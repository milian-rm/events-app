using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Domain.Constants;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;

namespace AuthService.Application.Services;

public class UserManagementService(IUserRepository users, IRoleRepository roles, ICloudinaryService cloudinary) : IUserManagementService
{
    public async Task<UserResponseDto> UpdateUserRoleAsync(string userId, string roleName)
    {
        roleName = roleName?.Trim().ToUpperInvariant() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(userId)) throw new ArgumentException("Invalid userId", nameof(userId));

        if (!RoleConstants.AllowedRoles.Contains(roleName))
            throw new InvalidOperationException($"Role not allowed. Only {RoleConstants.ADMIN_ROLE} is supported.");

        var user = await users.GetByIdAsync(userId);

        var isUserAdmin = user.UserRoles.Any(r => r.Role.Name == RoleConstants.ADMIN_ROLE);
        if (isUserAdmin && roleName != RoleConstants.ADMIN_ROLE)
        {
            var adminCount = await roles.CountUsersInRoleAsync(RoleConstants.ADMIN_ROLE);

            if (adminCount <= 1)
            {
                throw new InvalidOperationException("Cannot remove the last administrator");
            }
        }

        var role = await roles.GetByNameAsync(roleName)
                       ?? throw new InvalidOperationException($"Role {roleName} not found");

        await users.UpdateUserRoleAsync(userId, role.Id);

        user = await users.GetByIdAsync(userId);

        return new UserResponseDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            ProfilePhoto = cloudinary.GetFullImageUrl(user.UserProfile?.ProfilePhoto ?? string.Empty),
            Phone = user.UserProfile?.Phone ?? string.Empty,
            Role = roleName,
            Status = user.Status,
            IsEmailVerified = user.UserEmail?.EmailVerified ?? false,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    public async Task<IReadOnlyList<string>> GetUserRolesAsync(string userId)
    {
        var roleNames = await roles.GetUserRoleNamesAsync(userId);
        return roleNames;
    }

    public async Task<IReadOnlyList<UserResponseDto>> GetUsersByRoleAsync(string roleName)
    {
        roleName = roleName?.Trim().ToUpperInvariant() ?? string.Empty;
        var usersInRole = await roles.GetUsersByRoleAsync(roleName);
        return usersInRole.Select(u => new UserResponseDto
        {
            Id = u.Id,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Email = u.Email,
            ProfilePhoto = cloudinary.GetFullImageUrl(u.UserProfile?.ProfilePhoto ?? string.Empty),
            Phone = u.UserProfile?.Phone ?? string.Empty,
            Role = roleName,
            Status = u.Status,
            IsEmailVerified = u.UserEmail?.EmailVerified ?? false,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        }).ToList();
    }
}
