using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using UploadExcelAPI.Services;


namespace UploadExcelAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddDirectoryBrowser();
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Upload Inputs API", Version = "v1" });
            });
            services.AddCors(options => {
                options.AddPolicy("DevCorsPolicy", builder => builder
                   .AllowAnyHeader()
                   .AllowAnyOrigin()
                   .AllowAnyMethod());
            });
            services.AddTransient<IUploadExcelCostService, UploadExcelCostService>();
            services.AddTransient<IUploadExcelReferencePriceService, UploadExcelReferencePriceService>();
            services.AddTransient<IExportSummaryService, ExportSummaryService>();
            services.AddTransient<IAbilityRayongService, AbilityRayongService>();
            services.AddTransient<IAbilityKHMService, AbilityKHMService>();
            services.AddTransient<IVolumeConstrainMeterService, VolumeConstrainMeterService>();
            services.AddTransient<IVolumeConstrainKTService, VolumeConstrainKTService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Upload Inputs API v1"));
            }

            //var logFile = Path.Combine(env.ContentRootPath, $"logs/{DateTime.Now.Year}/{DateTime.Now.Month}/log-.log");
            //Log.Logger = new LoggerConfiguration().WriteTo.File(logFile, rollingInterval: RollingInterval.Day).CreateLogger();
            //loggerFactory.AddSerilog();
            //app.UseMiddleware<LoggingMiddleware>();

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();
            app.UseCors(options => {
                options.SetIsOriginAllowed(x => _ = true).AllowAnyMethod().AllowAnyHeader().AllowCredentials();
            });
            app.UseStaticFiles();
            string fileProvider = Directory.GetCurrentDirectory() + "/FileUpload";

            const string cacheMaxAge = "604800";
            var provider = new FileExtensionContentTypeProvider();
            // Replace an existing mapping
            provider.Mappings[".msg"] = "application/vnd.ms-outlook";
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(fileProvider),
                RequestPath = new PathString("/" + "FileUpload"),
                OnPrepareResponse = ctx =>
                {
                    // using Microsoft.AspNetCore.Http;
                    ctx.Context.Response.Headers.Append(
                        "Cache-Control", $"public, max-age={cacheMaxAge}");
                }
                    ,
                ContentTypeProvider = provider
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
