using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.Models;

public class MedicalRecord
{
    public int Id { get; set; }

    [Required]
    public int PatientId { get; set; }

    public Patient? Patient { get; set; }

    [Required]
    public int DoctorId { get; set; }

    public Doctor? Doctor { get; set; }

    public int? AppointmentId { get; set; }

    public Appointment? Appointment { get; set; }

    [MaxLength(1000)]
    public string Symptoms { get; set; } = string.Empty;

    [Required, MaxLength(1000)]
    public string Diagnosis { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Treatment { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Prescription { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Notes { get; set; } = string.Empty;

    public DateTime RecordDate { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}