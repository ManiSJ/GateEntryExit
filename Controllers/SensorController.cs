using GateEntryExit.Domain;
using GateEntryExit.Domain.Manager;
using GateEntryExit.Dtos.Gate;
using GateEntryExit.Dtos.GateExit;
using GateEntryExit.Dtos.Sensor;
using GateEntryExit.Dtos.Shared;
using GateEntryExit.Helper;
using GateEntryExit.Repositories;
using GateEntryExit.Repositories.Interfaces;
using GateEntryExit.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GateEntryExit.Controllers
{
    [Route("api/sensor")]
    [ApiController]
    public class SensorController : ControllerBase
    {
        private readonly ISensorRepository _sensorRepository;

        private readonly ISensorManager _sensorManager;

        private readonly IGuidGenerator _guidGenerator;

        private readonly ICacheService _cacheService;

        public SensorController(ISensorRepository sensorRepository,
            ISensorManager sensorManager,
            IGuidGenerator guidGenerator,
            ICacheService cacheService)
        {
            _sensorRepository = sensorRepository;
            _sensorManager = sensorManager;
            _guidGenerator = guidGenerator;
            _cacheService = cacheService;
        }

        [Route("create")]
        [HttpPost]
        public async Task<SensorDetailsDto> CreateAsync(CreateSensorDto input)
        {
            var isGateAlreadyHasSensor = await _sensorRepository.IsGateAlreadyHasSensorAsync(input.GateId);

            if (isGateAlreadyHasSensor)
                throw new Exception("Selected gate has a sensor");

            var sensor = _sensorManager.Create(_guidGenerator.Create(), input.GateId, input.Name);
            _cacheService.RemoveDatas("getAllSensors-*");
            await _sensorRepository.InsertAsync(sensor);

            return new SensorDetailsDto()
            {
                Id = sensor.Id,
                Name = sensor.Name,
                GateDetails = new GateDetailsDto()
                {
                    Id = sensor.GateId
                }
            };
        }

        [Route("edit")]
        [HttpPost]
        public async Task<SensorDetailsDto> EditAsync(UpdateSensorDto input)
        {
            await _sensorRepository.UpdateAsync(input.Id, input.Name);
            var sensor = await _sensorRepository.GetAsync(input.Id);
            _cacheService.RemoveDatas("getAllSensors-*");

            return new SensorDetailsDto()
            {
                Id = sensor.Id,
                Name = sensor.Name,
                GateDetails = new GateDetailsDto()
                {
                    Id = sensor.GateId
                }
            };
        }

        [HttpDelete("delete/{id}")]
        public async Task DeleteAsync(Guid id)
        {
            await _sensorRepository.DeleteAsync(id);
            _cacheService.RemoveDatas("getAllSensors-*");
        }

        [Route("getAll")]
        [HttpPost]
        public async Task<GetAllSensorsDto> GetAllAsync(GetAllDto input)
        {
            var cacheKey = $"getAllSensors-{input.SkipCount}-{input.MaxResultCount}-{input.Sorting}";
            var cacheData = _cacheService.GetData<GetAllSensorsDto>(cacheKey);

            if (cacheData != null)
            {
                return cacheData;
            }

            var result = new List<SensorDetailsDto>();

            var sensorsQueryabe = _sensorRepository.GetAll();

            var totalCount = await sensorsQueryabe.CountAsync();

            if (input != null)
            {
                sensorsQueryabe = sensorsQueryabe.OrderBy(p => p.Gate.Name).Skip(input.SkipCount).Take(input.MaxResultCount);
            }

            if (sensorsQueryabe.Count() > 0)
            {
                result = sensorsQueryabe.Select(s => new SensorDetailsDto()
                {
                    GateDetails = new GateDetailsDto()
                    {
                        Name = s.Gate.Name,
                        Id = s.Gate.Id
                    },
                    Id = s.Id,
                    Name = s.Name
                }).OrderBy(p => p.GateDetails.Name).ToList();
            }

            cacheData = new GetAllSensorsDto { Items = result, TotalCount = totalCount };
            _cacheService.SetData<GetAllSensorsDto>(cacheKey, cacheData, DateTime.Now.AddSeconds(30));
            return cacheData;
        }

        [Route("getAllWithDetails")]
        [HttpPost]
        public async Task<GetAllSensorWithDetailsOutputDto> GetAllWithDetails(GetAllSensorWithDetailsInputDto input)
        {
            var cacheKey = $"getAllSensorWithDetails-{input.SkipCount}-{input.MaxResultCount}-{input.Sorting}-{input.From}-{input.To}-";
            foreach(var gateId in input.GateIds)
            {
                cacheKey = cacheKey + $"{gateId}";
            }
            var cacheData = _cacheService.GetData<GetAllSensorWithDetailsOutputDto>(cacheKey);

            if (cacheData != null)
            {
                return cacheData;
            }

            if (input.From != null && input.To != null)
            {
                if(input.From > input.To)
                {
                    throw new Exception("From date must be less than To date");
                }
            }

            var allSensorWithDetailsQueryable = _sensorRepository.GetAllWithDetails();

            allSensorWithDetailsQueryable = FilterQuery(allSensorWithDetailsQueryable, input);

            var totalCount = await allSensorWithDetailsQueryable.CountAsync();

            var allSensorWithDetails = await allSensorWithDetailsQueryable
                                                .OrderBy(p => p.Gate.Name)
                                                .Skip(input.SkipCount)
                                                .Take(input.MaxResultCount)
                                                .ToListAsync();

            var getAllSensorWithDetails = GetAllSensorWithDetails(allSensorWithDetails, input);
            getAllSensorWithDetails.TotalCount = totalCount;

            cacheData = getAllSensorWithDetails;
            _cacheService.SetData(cacheKey, cacheData, DateTime.Now.AddSeconds(30));
            return cacheData;
        }

        private GetAllSensorWithDetailsOutputDto GetAllSensorWithDetails(List<Sensor> allSensorWithDetails, GetAllSensorWithDetailsInputDto input)
        {
            var getAllSensorWithDetails = new GetAllSensorWithDetailsOutputDto();
            var allSensorDetails = new List<SensorDetailsDto>();

            foreach (var sensorWithDetails in allSensorWithDetails)
            {
                var sensorDetails = new SensorDetailsDto();
                sensorDetails.Id = sensorWithDetails.Id;
                sensorDetails.Name = sensorWithDetails.Name;

                var gateDetails = new GateDetailsDto();
                gateDetails.Id = sensorWithDetails.Gate.Id;
                gateDetails.Name = sensorWithDetails.Gate.Name;

                var gateEntries = sensorWithDetails.Gate.GateEntries;
                var gateExits = sensorWithDetails.Gate.GateExits;

                if (input.From != null && input.To != null)
                {
                    gateEntries = sensorWithDetails.Gate.GateEntries.Where(p => p.TimeStamp >= input.From && p.TimeStamp <= input.To).ToList();
                    gateExits = sensorWithDetails.Gate.GateExits.Where(p => p.TimeStamp >= input.From && p.TimeStamp <= input.To).ToList();
                }
                else if (input.From != null && input.To == null)
                {
                    gateEntries = sensorWithDetails.Gate.GateEntries.Where(p => p.TimeStamp >= input.From).ToList();
                    gateExits = sensorWithDetails.Gate.GateExits.Where(p => p.TimeStamp >= input.From).ToList();
                }
                else if (input.From == null && input.To != null)
                {
                    gateEntries = sensorWithDetails.Gate.GateEntries.Where(p => p.TimeStamp <= input.To).ToList();
                    gateExits = sensorWithDetails.Gate.GateExits.Where(p => p.TimeStamp <= input.To).ToList();
                }

                gateDetails.EntryCount = gateEntries.Sum(p => p.NumberOfPeople);
                gateDetails.ExitCount = gateExits.Sum(p => p.NumberOfPeople);

                sensorDetails.GateDetails = gateDetails;

                allSensorDetails.Add(sensorDetails);
            }

            getAllSensorWithDetails.Items = allSensorDetails;

            return getAllSensorWithDetails;
        }

        private IQueryable<Sensor> FilterQuery(IQueryable<Sensor> allSensorWithDetailsQueryable, GetAllSensorWithDetailsInputDto input)
        {
            if (input.GateIds.Count() > 0)
                allSensorWithDetailsQueryable = allSensorWithDetailsQueryable.Where(s =>input.GateIds.Contains(s.Gate.Id));

            if (input.From != null && input.To != null)
            {
                allSensorWithDetailsQueryable = allSensorWithDetailsQueryable
                    .Where(s => s.Gate.GateEntries.Any(p => p.TimeStamp >= input.From && p.TimeStamp <= input.To) ||
                        s.Gate.GateExits.Any(p => p.TimeStamp >= input.From && p.TimeStamp <= input.To));
            }
            else if (input.From != null && input.To == null)
            {
                allSensorWithDetailsQueryable = allSensorWithDetailsQueryable
                    .Where(s => s.Gate.GateEntries.Any(p => p.TimeStamp >= input.From) ||
                        s.Gate.GateExits.Any(p => p.TimeStamp >= input.From));
            }
            else if (input.From == null && input.To != null)
            {
                allSensorWithDetailsQueryable = allSensorWithDetailsQueryable
                    .Where(s => s.Gate.GateEntries.Any(p => p.TimeStamp <= input.To) ||
                        s.Gate.GateExits.Any(p => p.TimeStamp <= input.To));
            }

            return allSensorWithDetailsQueryable;
        }
    }
}
