var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://localhost:5005");

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); 

builder.Services.AddOpenApi();

builder.Services.AddSingleton<GoldenFruit.Backend.Database.AppDbContext>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();     
    app.UseSwagger();    
    app.UseSwaggerUI();    
}

app.UseCors("AllowAll");
app.MapControllers();

app.MapGet("/", () => "GoldenFruit Backend 5005 portunda hazır!");

app.Run();