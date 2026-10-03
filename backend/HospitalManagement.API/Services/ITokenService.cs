using HospitalManagement.API.Models;

namespace HospitalManagement.API.Services;

public interface ITokenService
{
    Task<string> CreateTokenAsync(ApplicationUser user);
}
