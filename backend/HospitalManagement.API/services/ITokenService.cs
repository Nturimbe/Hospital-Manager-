using HospitalManagement.API.Models;

namespace HospitalManagement.API.Services
{
    public interface ITokenService
    {
        string CreateToken(ApplicationUser user);
    }
}