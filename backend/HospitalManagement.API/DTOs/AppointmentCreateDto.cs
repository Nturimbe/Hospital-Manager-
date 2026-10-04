using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.DTOs;

public class AppointmentCreateDto
{
    [Required]
    public int DoctorId { get; set; }

    [Required]
    public DateTime AppointmentDate { get; set; }

    [Required, MaxLength(500)]
    public string Reason { get; set; } = string.Empty;
}