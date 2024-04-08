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
using OfficeOpenXml;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

        [Route("getAllWithDetailsExcelReport")]
        [HttpPost]
        public async Task GetAllWithDetailsExcelReportAsync(GetAllSensorWithDetailsReportInputDto input)
        {
            var allSensorWithDetailsQueryable = _sensorRepository.GetAllWithDetails();
            allSensorWithDetailsQueryable = FilterQuery(allSensorWithDetailsQueryable, input.GateIds, input.FromDate, input.ToDate);
            var allSensorWithDetails = await allSensorWithDetailsQueryable
                                                .OrderBy(p => p.Gate.Name)
                                                .ToListAsync();

            var getAllSensorWithDetails = GetAllSensorWithDetails(allSensorWithDetails, input.FromDate, input.ToDate);
            var sensorDetails = getAllSensorWithDetails.Items;

            SaveExcelReport(sensorDetails);
        }

        private void SaveExcelReport(List<SensorDetailsDto> sensorDetails)
        {
            string excelFilePath = Path.GetFullPath(Path.Combine("Excel", "Export", "SensorWithDetails.xlsx"));
            FileInfo excelFile = new FileInfo(excelFilePath);

            DeleteIfFileExists(excelFile);

            using (ExcelPackage excelPackage = new ExcelPackage(excelFile))
            {
                ExcelWorksheet worksheet = excelPackage.Workbook.Worksheets.Add("SensorWithDetails");

                // Define column headers
                worksheet.Cells[1, 1].Value = "Sensor name";
                worksheet.Cells[1, 2].Value = "Gate name";
                worksheet.Cells[1, 3].Value = "Gate entry count";
                worksheet.Cells[1, 4].Value = "Gate exit count";

                // Populate data
                for (int i = 0; i < sensorDetails.Count; i++)
                {
                    worksheet.Cells[i + 2, 1].Value = sensorDetails[i].Name;
                    worksheet.Cells[i + 2, 2].Value = sensorDetails[i].GateDetails.Name;
                    worksheet.Cells[i + 2, 3].Value = sensorDetails[i].GateDetails.EntryCount;
                    worksheet.Cells[i + 2, 4].Value = sensorDetails[i].GateDetails.ExitCount;
                }

                // Formatting
                worksheet.Row(1).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                worksheet.Row(1).Style.Font.Bold = true;

                for (int i = 2; i <= sensorDetails.Count() + 1; i++)
                {
                    worksheet.Row(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                }

                // Save the Excel file
                excelPackage.SaveAs(excelFile);
            }
        }

        private void DeleteIfFileExists(FileInfo excelFile)
        {
            if (excelFile.Exists)
            {
                excelFile.Delete();
            }
        }

        [Route("getAllWithDetails")]
        [HttpPost]
        public async Task<GetAllSensorWithDetailsOutputDto> GetAllWithDetailsAsync(GetAllSensorWithDetailsInputDto input)
        {
            var cacheKey = $"getAllSensorWithDetails-{input.SkipCount}-{input.MaxResultCount}-{input.Sorting}-{input.FromDate}-{input.ToDate}-";
            foreach(var gateId in input.GateIds)
            {
                cacheKey = cacheKey + $"{gateId}";
            }
            var cacheData = _cacheService.GetData<GetAllSensorWithDetailsOutputDto>(cacheKey);

            if (cacheData != null)
            {
                return cacheData;
            }

            if (input.FromDate != null && input.ToDate != null)
            {
                if(input.FromDate > input.ToDate)
                {
                    throw new Exception("From date must be less than To date");
                }
            }

            var allSensorWithDetailsQueryable = _sensorRepository.GetAllWithDetails();

            allSensorWithDetailsQueryable = FilterQuery(allSensorWithDetailsQueryable, input.GateIds, input.FromDate, input.ToDate);

            var totalCount = await allSensorWithDetailsQueryable.CountAsync();

            var allSensorWithDetails = await allSensorWithDetailsQueryable
                                                .OrderBy(p => p.Gate.Name)
                                                .Skip(input.SkipCount)
                                                .Take(input.MaxResultCount)
                                                .ToListAsync();

            var getAllSensorWithDetails = GetAllSensorWithDetails(allSensorWithDetails, input.FromDate, input.ToDate);
            getAllSensorWithDetails.TotalCount = totalCount;

            cacheData = getAllSensorWithDetails;
            _cacheService.SetData(cacheKey, cacheData, DateTime.Now.AddSeconds(30));
            return cacheData;
        }

        private GetAllSensorWithDetailsOutputDto GetAllSensorWithDetails(List<Sensor> allSensorWithDetails, 
            DateTime? fromDate,
            DateTime? toDate)
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

                if (fromDate != null && toDate != null)
                {
                    gateEntries = sensorWithDetails.Gate.GateEntries.Where(p => p.TimeStamp >= fromDate && p.TimeStamp <= toDate).ToList();
                    gateExits = sensorWithDetails.Gate.GateExits.Where(p => p.TimeStamp >= fromDate && p.TimeStamp <= toDate).ToList();
                }
                else if (fromDate != null && toDate == null)
                {
                    gateEntries = sensorWithDetails.Gate.GateEntries.Where(p => p.TimeStamp >= fromDate).ToList();
                    gateExits = sensorWithDetails.Gate.GateExits.Where(p => p.TimeStamp >= fromDate).ToList();
                }
                else if (fromDate == null && toDate != null)
                {
                    gateEntries = sensorWithDetails.Gate.GateEntries.Where(p => p.TimeStamp <= toDate).ToList();
                    gateExits = sensorWithDetails.Gate.GateExits.Where(p => p.TimeStamp <= toDate).ToList();
                }

                gateDetails.EntryCount = gateEntries.Sum(p => p.NumberOfPeople);
                gateDetails.ExitCount = gateExits.Sum(p => p.NumberOfPeople);

                sensorDetails.GateDetails = gateDetails;

                allSensorDetails.Add(sensorDetails);
            }

            getAllSensorWithDetails.Items = allSensorDetails;

            return getAllSensorWithDetails;
        }

        private IQueryable<Sensor> FilterQuery(IQueryable<Sensor> allSensorWithDetailsQueryable, Guid[] gateIds, 
            DateTime? fromDate, 
            DateTime? toDate)
        {
            if (gateIds.Count() > 0)
                allSensorWithDetailsQueryable = allSensorWithDetailsQueryable.Where(s => gateIds.Contains(s.Gate.Id));

            if (fromDate != null && toDate != null)
            {
                allSensorWithDetailsQueryable = allSensorWithDetailsQueryable
                    .Where(s => s.Gate.GateEntries.Any(p => p.TimeStamp >= fromDate && p.TimeStamp <= toDate) ||
                        s.Gate.GateExits.Any(p => p.TimeStamp >= fromDate && p.TimeStamp <= toDate));
            }
            else if (fromDate != null && toDate == null)
            {
                allSensorWithDetailsQueryable = allSensorWithDetailsQueryable
                    .Where(s => s.Gate.GateEntries.Any(p => p.TimeStamp >= fromDate) ||
                        s.Gate.GateExits.Any(p => p.TimeStamp >= fromDate));
            }
            else if (fromDate == null && toDate != null)
            {
                allSensorWithDetailsQueryable = allSensorWithDetailsQueryable
                    .Where(s => s.Gate.GateEntries.Any(p => p.TimeStamp <= toDate) ||
                        s.Gate.GateExits.Any(p => p.TimeStamp <= toDate));
            }

            return allSensorWithDetailsQueryable;
        }
    }
}
