// <copyright file="Startup.cs" company="<%= companyName %>">
//   Copyright (C) <%= companyName %>. All rights reserved.
// </copyright>

namespace <%= webapirootnamespace %>
{
    using System.IO;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Authentication.AzureAD.UI;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.OpenApi.Models;
    using Options;

    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            this.Configuration = configuration;
            this.CurrentEnvironment = webHostEnvironment;
        }

        /// <summary>
        /// The environment of the web host as defined by the ASPNETCORE_ENVIRONMENT environment variable
        /// </summary>
        public IWebHostEnvironment CurrentEnvironment { get; }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CoOwnerApiOptions>(options => this.Configuration.Bind("CoOwnerApi", options));
            services.Configure<AzureADOptions>(options => this.Configuration.Bind("AzureAd", options));

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = this.GetStaticFilePath();
            });

            services.AddApplicationInsightsTelemetry();

            services.AddAuthentication(AzureADDefaults.BearerAuthenticationScheme)
                    .AddAzureADBearer(options => this.Configuration.Bind("AzureAd", options));

            services.AddAuthorization(options =>
            {
                options.AddPolicy(UserRoles.Administrator, policy => policy.RequireRole("Administrator"));
            });

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });

            services.AddControllers();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo() { Title = "Catalog Web API", Version = "v1" });
            });
            services.AddSwaggerGenNewtonsoftSupport();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Environmental options relate to our stages to include the following options:
            // Development: Local development on our dev machines
            // Dev: Dev stage on Azure
            // PPE: PPE stage on Azure
            // Production: Prod stage on azure
            if (env.IsDevelopment() || env.IsEnvironment("Dev"))
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            // Local development uses `ng serve` for easier watching for changes
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseSwagger();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseCors(policy =>
            {
                policy.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin();
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            if (!env.IsDevelopment())
            {
                app.UseSpa(configuration => { });
            }
        }

        private string GetStaticFilePath()
        {
            if (this.CurrentEnvironment.IsProduction())
            {
                return Path.Join("wwwroot", "prod");
            }

            return Path.Join("wwwroot", this.CurrentEnvironment.EnvironmentName.ToLowerInvariant());
        }
    }
}
