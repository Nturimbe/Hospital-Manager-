using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.DTOs;

public class MedicalRecordDto
{
    [Required]
    public int PatientId { get; set; }

    [Required]
    public int DoctorId { get; set; }

    public int? AppointmentId { get; set; }

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
}