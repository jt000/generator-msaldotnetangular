// <copyright file="PingController.cs" company="<%= companyName %>">
//   Copyright (C) <%= companyName %>. All rights reserved.
// </copyright>

namespace <%= webapirootnamespace %>.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;

    [ApiController]
    [Route("api/[controller]")]
    public class PingController : ControllerBase
    {
        private readonly ILogger<PingController> logger;

        public PingController(ILogger<PingController> logger)
        {
            this.logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Get()
        {
            this.logger.LogTrace("Ping received");
            return this.Ok();
        }

        [HttpGet("admin")]
        [Authorize()]
        public IActionResult GetAdmin()
        {
            this.logger.LogTrace("Ping admin received");
            return this.Ok();
        }
    }
}
