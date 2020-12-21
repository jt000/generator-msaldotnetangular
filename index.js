const Generator = require('yeoman-generator');
var ejs = require('ejs');
const path = require('path');
const glob = require('glob');
const isValidPath = require('is-valid-path');

module.exports = class extends Generator {

  params = {};

  constructor(args, opts) {
    super(args, opts);

    this.option('generate', {
      type: Boolean,
      hide: true,
      description: 'Generate the template.json from the templates files.',
      default: false
    });
  }

  initializing() {
    Object.assign(this.params, { generate: this.options['generate'] });
  }

  async prompting() {
    if (this.params.generate) {
      return;
    }

    const answers = await this.prompt([
      {
        type: "input",
        name: "companyName",
        message: "Your Company's name used in copywrites:",
        validate: (i) => this._isNotEmptyString(i),
        store: true
      },
      {
        type: "input",
        name: "webapiname",
        message: "Your .NET WebAPI project name:",
        default: "WebApi",
        validate: (i) => this._isNotEmptyString(i)
      },
      {
        type: "input",
        name: "webapiassemblyname",
        message: "Your Web API assembly name:",
        default: (p) => p.webapiname,
        validate: (i) => this._isNotEmptyString(i)
      },
      {
        type: "input",
        name: "webapirootnamespace",
        message: "Your Web API namespace:",
        default: (p) => `${p.companyName}.${p.webapiname}`,
        validate: (i) => this._isNotEmptyString(i)
      },
      {
        type: "input",
        name: "webapifoldername",
        message: "Your .NET WebAPI folder name:",
        default: (p) => p.webapiname.toLowerCase(),
        validate: (i) => this._isValidDirectoryName(i)
      },
      {
        type: "input",
        name: "webclientname",
        message: "Your Angular client project name:",
        default: "WebClient",
        validate: (i) => this._isNotEmptyString(i)
      },
      {
        type: "input",
        name: "webclientfoldername",
        message: "Your Angular client folder name:",
        default: (p) => p.webclientname.toLowerCase(),
        validate: (i) => this._isValidDirectoryName(i)
      },
      {
        type: "input",
        name: "aadTenantDomainName",
        message: "Your Azure Active Directory tenant name (ex: contosob2c):",
        validate: (i) => this._isNotEmptyString(i)
      },
      {
        type: "input",
        name: "aadB2CSignInPolicyName",
        message: "Your AAD B2C Sign-In Policy Name (ex: B2C_1_signupsignin1):",
        validate: (i) => this._isNotEmptyString(i)
      },
      {
        type: "input",
        name: "aadWebApiAppIdDev",
        message: "Your AAD Application Id for Web API Dev:",
        validate: (i) => this._isValidGuid(i)
      },
      {
        type: "input",
        name: "aadWebApiAppIdProd",
        message: "Your AAD Application Id for Web API Prod:",
        validate: (i) => this._isValidGuid(i)
      },
      {
        type: "input",
        name: "aadWebClientAppIdDev",
        message: "Your AAD Application Id for Web Client Dev:",
        validate: (i) => this._isValidGuid(i)
      },
      {
        type: "input",
        name: "aadWebClientAppIdProd",
        message: "Your AAD Application Id for Web Client Prod:",
        validate: (i) => this._isValidGuid(i)
      },
      {
        type: "input",
        name: "prodWebApiUriRoot",
        message: "Your Url for the deployed Web API Prod:",
        validate: (i) => this._isNotEmptyString(i)
      }
    ]);

    Object.assign(this.params, answers);
  }

  configuring() {
    if (this.params.generate) {
      return;
    }
  }

  async writing() {
    if (this.params.generate) {
      const config = { files: [] };
      glob.sync(path.join(this.sourceRoot(), "**/*.*"))
          .forEach(f => {
            const localSrc = path.relative(this.sourceRoot(), f);
            config.files.push({
              source: localSrc,
              destination: localSrc
            });
          });
        this.writeDestinationJSON(path.join(this.sourceRoot(), "../templates.json"), config);
      } else {
      // Read templated templates.json
      const config = await this._readConfigJSON();
      
      // Render templates listed
      await this.renderTemplates(config.files, this.params);
    }
  }

  async install() {
    if (this.params.generate) {
      return;
    }

    await this.spawnCommand("dotnet", ["restore", `${this.params.webapiname}.csproj`], { cwd: this.params.webapifoldername });
    await this.spawnCommand("npm", ["install"], { cwd: this.params.webclientfoldername });
  }

  _isNotEmptyString(i, minLength) {
    minLength = minLength || 1;

    if (typeof i !== 'string') return 'Input is not a valid string.';
    if (i.length < minLength) return `Input length must be at least ${minLength} character(s).`;

    return true;
  }

  _isValidGuid(i) {
    const regEx = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!regEx.test(i)) return 'Input must be a valid GUID. For example: 00000000-0000-0000-0000-000000000000.'

    return true;
  }

  _isValidDirectoryName(i) {
    const pathInfo = path.parse(i);
    if (pathInfo.root !== '') return 'Path must not be absolute. Do not start with a drive or "\\".';
    if (pathInfo.dir !== '') return 'Path must not be nested in a parent directory.';
    if (!isValidPath(i)) return 'Path contains invalid characters';

    return true;
  }

  async _readConfigJSON() {
    const templatesJsonPath = path.join(this.sourceRoot(), "../templates.json");
    let json = this.fs.read(templatesJsonPath);

    json = await ejs.render(json, this.params, { async: true });
    const config = JSON.parse(json);

    return config;
  }
};