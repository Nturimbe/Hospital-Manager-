using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.Models;

public class Appointment
{
    public int Id { get; set; }

    [Required]
    public int PatientId { get; set; }

    public Patient? Patient { get; set; }

    [Required]
    public int DoctorId { get; set; }

    public Doctor? Doctor { get; set; }

    [Required]
    public DateTime AppointmentDate { get; set; }

    [Required, MaxLength(500)]
    public string Reason { get; set; } = string.Empty;

    [Required, MaxLength(30)]
    public string Status { get; set; } = "Scheduled";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}