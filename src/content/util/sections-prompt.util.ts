const sectionQueries = [
  {
    section: 'OVERVIEW',
    queryString:
      'README introduction about description purpose goals overview project summary what is vision objectives main functionality',
    prompt:
      "Extract a comprehensive project overview by analyzing README files, introduction sections, and project descriptions. Focus on the project's core purpose, main objectives, key functionalities, target audience, and overall vision. Include any problem statements the project addresses and its unique value proposition. Present this in a way that's accessible to both technical and non-technical audiences.",
  },
  {
    section: 'INSTALLATION',
    queryString:
      'install setup requirements dependencies npm pip composer yarn brew apt-get docker getting started prerequisites environment setup',
    prompt:
      'Compile detailed installation instructions by examining package.json, requirements.txt, Dockerfile, setup scripts, and installation documentation. Include system requirements, prerequisite software, step-by-step installation commands, environment setup, dependency installation, and post-installation verification steps. Address common installation issues and provide platform-specific instructions where applicable.',
  },
  {
    section: 'USAGE',
    queryString:
      'usage examples commands CLI API how to use run execute demo tutorial quickstart getting started basic usage',
    prompt:
      'Create comprehensive usage documentation by analyzing code examples, CLI commands, API calls, demo files, and tutorial content. Provide step-by-step usage instructions, practical examples with expected outputs, configuration options, command-line parameters, and common use cases. Include both basic and advanced usage scenarios with clear explanations.',
  },
  {
    section: 'TECH-STACK',
    queryString:
      'technology stack framework library language dependencies tools built with powered by uses requires Python JavaScript React Node.js',
    prompt:
      'Identify and document the complete technology stack by examining package files, import statements, configuration files, and documentation. Detail programming languages, frameworks, libraries, databases, build tools, deployment platforms, and development tools. Explain the role of each technology and why it was chosen for the project architecture.',
  },
  {
    section: 'FEATURES',
    queryString:
      'features functionality capabilities what it does key features highlights benefits core features advanced features modules components',
    prompt:
      "Extract and organize all project features by analyzing documentation, code comments, feature lists, and functionality descriptions. Categorize features into core and advanced capabilities, explain each feature's purpose and benefits, provide use case examples, and highlight unique or innovative aspects that differentiate the project.",
  },
  {
    section: 'CONTRIBUTING',
    queryString:
      'contributing contribution guide guidelines pull request code style development workflow collaboration how to contribute',
    prompt:
      'Compile comprehensive contribution guidelines from CONTRIBUTING.md, development documentation, and project guidelines. Include the contribution process, code style requirements, branch management, testing procedures, pull request guidelines, issue reporting, development setup for contributors, and community standards.',
  },
  {
    section: 'LICENSE',
    queryString:
      'license licensing MIT Apache GPL BSD copyright terms conditions permissions restrictions legal usage rights',
    prompt:
      'Document licensing information by examining LICENSE files, package.json license fields, and copyright notices. Explain the license type, permissions granted, restrictions imposed, attribution requirements, and implications for users and contributors. Provide guidance on license compliance and usage rights.',
  },
  {
    section: 'ENVIRONMENT VARIABLES',
    queryString:
      'environment variables env config .env configuration settings API keys secrets database URL port host',
    prompt:
      'Identify and document all environment variables by analyzing .env files, configuration documentation, and code references. For each variable, provide the name, purpose, expected format, default values, required vs optional status, and security considerations. Include setup instructions for different environments.',
  },
  {
    section: 'CONFIGURATION',
    queryString:
      'configuration config settings options parameters customization setup modify behavior environment production development',
    prompt:
      'Document configuration options by examining config files, settings documentation, and configuration schemas. Explain each configuration parameter, its effect on system behavior, valid values, default settings, and environment-specific configurations. Provide examples for common configuration scenarios.',
  },
  {
    section: 'FOLDER STRUCTURE',
    queryString:
      'folder structure directory organization architecture layout files directories tree project structure src lib components',
    prompt:
      "Analyze and document the project's folder structure by examining the directory hierarchy and file organization. Explain the purpose of each major directory, key files, naming conventions, and how the structure supports project modularity and maintainability. Include any architectural patterns reflected in the organization.",
  },
  {
    section: 'DEPENDENCIES',
    queryString:
      'dependencies packages libraries modules requirements package.json requirements.txt composer.json external libraries third-party',
    prompt:
      'Document all project dependencies by analyzing package.json, requirements.txt, composer.json, and other dependency files. Categorize dependencies into production, development, and optional, explain their purposes, version constraints, and any special installation or configuration requirements.',
  },
  {
    section: 'DATABASE SCHEMA',
    queryString:
      'database schema SQL tables models migrations relationships ER diagram data structure entities database design',
    prompt:
      "Document the database structure by examining schema files, migration scripts, model definitions, and database documentation. Describe table structures, relationships, constraints, indexes, and data flow. Include any database design principles and explain how the schema supports the application's data requirements.",
  },
  {
    section: 'API DOCUMENTATION',
    queryString:
      'API documentation endpoints routes REST GraphQL authentication parameters responses examples Swagger OpenAPI',
    prompt:
      'Compile comprehensive API documentation by analyzing API route definitions, Swagger/OpenAPI specs, and endpoint documentation. Document all endpoints with their HTTP methods, parameters, request/response formats, authentication requirements, error codes, and practical usage examples.',
  },
  {
    section: 'DEPLOYMENT',
    queryString:
      'deployment deploy hosting cloud Docker Kubernetes CI/CD pipeline production build release server infrastructure',
    prompt:
      'Document the deployment process by examining deployment scripts, CI/CD configurations, Docker files, and hosting documentation. Provide step-by-step deployment instructions for different environments, infrastructure requirements, scaling considerations, and continuous deployment setup.',
  },
  {
    section: 'SCREENSHOTS',
    queryString:
      'screenshots images demo UI interface visual examples gallery preview mockups wireframes user interface',
    prompt:
      "Document visual assets by identifying screenshots, demo images, UI previews, and visual documentation. Describe what each image demonstrates, the context in which it's relevant, and how it showcases the project's features or user interface. Include captions and explanations for better understanding.",
  },
  {
    section: 'ROADMAP',
    queryString:
      'roadmap future plans upcoming features milestones TODO changelog version planning development timeline goals',
    prompt:
      "Extract future development plans by analyzing roadmap documents, TODO lists, issue trackers, and changelog entries. Organize planned features by priority or timeline, explain strategic goals, upcoming milestones, and how future developments will enhance the project's capabilities.",
  },
  {
    section: 'FAQ',
    queryString:
      'FAQ frequently asked questions troubleshooting common issues problems solutions help support Q&A',
    prompt:
      'Compile frequently asked questions by analyzing FAQ sections, issue trackers, support documentation, and common user queries. Provide comprehensive answers to each question, including troubleshooting steps, explanations, and links to relevant documentation or resources.',
  },
  {
    section: 'ACKNOWLEDGEMENTS',
    queryString:
      'acknowledgements credits thanks contributors inspiration acknowledgment attribution special thanks team members',
    prompt:
      "Document acknowledgements by identifying contributors, inspirations, and external resources mentioned in credits or acknowledgement sections. Explain each contribution's significance, provide proper attribution, and highlight the collaborative nature of the project's development.",
  },
  {
    section: 'SUPPORT',
    queryString:
      'support help contact community forum discussion issue tracker bug report email chat assistance',
    prompt:
      'Document support channels by examining contact information, community links, and support documentation. Provide clear instructions on how to get help, report issues, contact maintainers, and participate in community discussions. Include response time expectations and preferred communication methods.',
  },
  {
    section: 'PROJECT STATUS',
    queryString:
      'status active maintained deprecated stable beta alpha development phase release version lifecycle',
    prompt:
      "Determine project status by analyzing commit activity, release history, maintenance indicators, and status badges. Provide current development status, maintenance level, stability indicators, recent activity summary, and any deprecation notices or future plans affecting the project's lifecycle.",
  },
  {
    section: 'AUTHOR',
    queryString:
      'author maintainer creator developer team contact profile biography background experience social media',
    prompt:
      'Document author information by examining profile details, contact information, and contributor data. Provide background information about the main author or development team, their expertise, contact methods, and links to professional profiles or social media accounts.',
  },
];

export default sectionQueries;
