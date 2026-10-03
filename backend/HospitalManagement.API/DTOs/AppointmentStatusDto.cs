using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.DTOs;

public class AppointmentStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty;
}