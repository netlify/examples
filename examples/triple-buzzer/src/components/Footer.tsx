export function Footer() {
  return (
    <div className="flex gap-4">
      <a
        href="https://github.com/netlify-templates/triple-buzzer"
        target="_blank"
        rel="noopener noreferrer"
        role="button"
        className="btn btn-sm btn-ghost uppercase"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        <span className="hidden lg:inline">View code</span>
        <span className="lg:hidden">Code</span>
      </a>
      <a
        href="https://app.netlify.com/integration/start/deploy?repository=https://github.com/netlify-templates/triple-buzzer"
        target="_blank"
        rel="noopener noreferrer"
        role="button"
        className="btn btn-sm btn-ghost uppercase"
      >
        <svg className="w-6 h-6" viewBox="0 0 128 113">
          <g clipPath="url(#clip0_236_179)">
            <path
              d="M34.593 94.2052H33.3844L27.3514 88.1722V86.9637L36.5743 77.7409H42.9639L43.8158 78.5928V84.9824L34.593 94.2052Z"
              fill="#181A1C"
            />
            <path
              d="M27.3514 25.9703V24.7617L33.3844 18.7287H34.593L43.8158 27.9515V34.3411L42.9639 35.1931H36.5743L27.3514 25.9703Z"
              fill="#181A1C"
            />
            <path
              d="M80.4594 74.759H71.6824L70.9493 74.026V53.4802C70.9493 49.8248 69.5129 46.9915 65.1046 46.8925C62.836 46.833 60.2405 46.8925 57.4668 47.0014L57.0507 47.4274V74.0161L56.3176 74.7491H47.5406L46.8075 74.0161V38.9179L47.5406 38.1848H67.2939C74.9713 38.1848 81.1925 44.406 81.1925 52.0834V74.026L80.4594 74.759Z"
              fill="#181A1C"
            />
            <path
              d="M35.8412 61.6034H0.73307L0 60.8703V52.0735L0.73307 51.3404H35.8412L36.5743 52.0735V60.8703L35.8412 61.6034Z"
              fill="#181A1C"
            />
            <path
              d="M127.277 61.6034H92.1687L91.4356 60.8703V52.0735L92.1687 51.3404H127.277L128.01 52.0735V60.8703L127.277 61.6034Z"
              fill="#181A1C"
            />
            <path
              d="M58.9428 27.2185V0.887367L59.6759 0.154297H68.4727L69.2058 0.887367V27.2185L68.4727 27.9515H59.6759L58.9428 27.2185Z"
              fill="#181A1C"
            />
            <path
              d="M58.9428 112.056V85.7254L59.6759 84.9923H68.4727L69.2058 85.7254V112.056L68.4727 112.79H59.6759L58.9428 112.056Z"
              fill="#181A1C"
            />
          </g>
          <defs>
            <clipPath id="clip0_236_179">
              <rect
                width="128"
                height="112.635"
                fill="white"
                transform="translate(0 0.154297)"
              />
            </clipPath>
          </defs>
        </svg>
        <span className="hidden lg:inline">Deploy to Netlify</span>
        <span className="lg:hidden">Deploy</span>
      </a>
    </div>
  );
}
