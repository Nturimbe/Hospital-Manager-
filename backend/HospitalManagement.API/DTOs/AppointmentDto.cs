using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.DTOs;

public class AppointmentDto
{
    [Required]
    public int PatientId { get; set; }

    [Required]
    public int DoctorId { get; set; }

    [Required]
    public DateTime AppointmentDate { get; set; }

    [Required, MaxLength(500)]
    public string Reason { get; set; } = string.Empty;
}