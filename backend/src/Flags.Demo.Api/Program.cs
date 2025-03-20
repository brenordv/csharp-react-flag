using Flags.Demo.Api.Data;
using Flags.Demo.Api.Enums;
using Flags.Demo.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=flags-demo.db"));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Your React app URL
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials(); // If using authentication
        });
});

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseSwagger();
app.UseSwaggerUI();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated();
}


app.MapGet("/users", async (AppDbContext db) => await db.Users.ToListAsync());


app.MapGet("/users/{id}", async (Guid id, AppDbContext db) =>
    await db.Users.FindAsync(id) is User user
        ? Results.Ok(user)
        : Results.NotFound());

app.MapPost("/users", async (UserCreateRequest request, AppDbContext db) =>
{
    var user = new User
    {
        Id = Guid.NewGuid(),
        Name = request.Name,
        Email = request.Email,
        Roles = request.Roles,
        Permissions = request.Permissions,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
        LastLogin = DateTime.UtcNow
    };

    db.Users.Add(user);
    await db.SaveChangesAsync();

    return Results.Created($"/users/{user.Id}", user);
});

app.MapPut("/users/{id}", async (Guid id, UserUpdateRequest request, AppDbContext db) =>
{
    var user = await db.Users.FindAsync(id);
    if (user is null) return Results.NotFound();

    // No need to worry about if the user already have the role. Since this is a bitwise operation,
    // it will not add the role if it already exists.

    if (request.AddRoles.HasValue)
        user.Roles |= request.AddRoles.Value;

    if (request.RemoveRoles.HasValue)
        user.Roles &= ~request.RemoveRoles.Value;

    if (request.AddPermissions.HasValue)
        user.Permissions |= request.AddPermissions.Value;

    if (request.RemovePermissions.HasValue)
        user.Permissions &= ~request.RemovePermissions.Value;

    if (!string.IsNullOrWhiteSpace(request.Name))
        user.Name = request.Name;

    if (!string.IsNullOrWhiteSpace(request.Email))
        user.Email = request.Email;

    user.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();

    return Results.Ok(user);
});

// Delete user
app.MapDelete("/users/{id}", async (Guid id, AppDbContext db) =>
{
    var user = await db.Users.FindAsync(id);
    if (user is null) return Results.NotFound();

    db.Users.Remove(user);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

// Check if user has specific role
app.MapGet("/users/{id}/has-role/{role}", async (Guid id, UserRoles role, AppDbContext db) =>
{
    var user = await db.Users.FindAsync(id);
    if (user is null) return Results.NotFound();

    // Check if user has the specific role using bitwise AND
    bool hasRole = (user.Roles & role) == role;
    
    return Results.Ok(new { UserId = id, Role = role.ToString(), HasRole = hasRole });
});

// Check if user has specific permission
app.MapGet("/users/{id}/has-permission/{permission}", async (Guid id, UserPermissions permission, AppDbContext db) =>
{
    var user = await db.Users.FindAsync(id);
    if (user is null) return Results.NotFound();

    // Check if user has the specific permission using bitwise AND
    bool hasPermission = (user.Permissions & permission) == permission;
    
    return Results.Ok(new { UserId = id, Permission = permission.ToString(), HasPermission = hasPermission });
});

app.Run();
