using GateEntryExit.Dtos.Shared;

namespace GateEntryExit.Dtos.Sensor
{
    public class GetAllSensorWithDetailsInputDto : GetAllDto
    {
        public Guid[] GateIds { get; set; }

        public DateTime? From { get; set; } 

        public DateTime? To { get; set; }
    }
}
