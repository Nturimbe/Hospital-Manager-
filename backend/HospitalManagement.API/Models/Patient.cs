using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.Models;

public class Patient
{
    public int Id { get; set; }
    public string? UserId { get; set; }

    [Required, MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public DateTime DateOfBirth { get; set; }

    [Required, MaxLength(20)]
    public string Gender { get; set; } = string.Empty;

    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [MaxLength(250)]
    public string Address { get; set; } = string.Empty;

    [MaxLength(100)]
    public string EmergencyContactName { get; set; } = string.Empty;

    [MaxLength(20)]
    public string EmergencyContactPhone { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ApplicationUser? User { get; set; }

    public ICollection<Appointment> Appointments { get; set; }
        = new List<Appointment>();

    public ICollection<MedicalRecord> MedicalRecords { get; set; }
        = new List<MedicalRecord>();
}