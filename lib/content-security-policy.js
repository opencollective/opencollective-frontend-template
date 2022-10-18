/* eslint-disable no-process-env */

const mergeWith = require('lodash/mergeWith');
const { kebabCase, omit } = require('lodash');

const SELF = "'self'";
const NONE = "'none'";
const UNSAFE_INLINE = "'unsafe-inline'";
const UNSAFE_EVAL = "'unsafe-eval'";

const COMMON_DIRECTIVES = {
  blockAllMixedContent: [],
  defaultSrc: [SELF],
  imgSrc: [
    SELF,
    'blog.opencollective.com', // used to easily link images in static pages
    'images.opencollective.com', // For upload images previews
    'images-staging.opencollective.com', // For upload images previews
  ],
  workerSrc: [NONE],
  styleSrc: [
    SELF,
    UNSAFE_INLINE, // For styled-components. TODO: Limit for nonce
  ],
  connectSrc: [SELF, 'https://*.opencollective.com'],
  scriptSrc: [SELF],
  frameSrc: [NONE],
  objectSrc: [NONE],
};

const generateDirectives = customValues => {
  const toRemove = [];

  const result = mergeWith(COMMON_DIRECTIVES, customValues, (objValue, srcValue, key) => {
    if (typeof srcValue === 'boolean') {
      if (!srcValue) {
        toRemove.push(key);
      }
      return srcValue;
    } else if (Array.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });

  return omit(result, toRemove);
};

/**
 * A adapter inspired by  https://github.com/helmetjs/helmet/blob/master/middlewares/content-security-policy/index.ts
 * to generate the header string. Useful for plugging to Vercel.
 */
const getHeaderValueFromDirectives = directives => {
  return Object.entries(directives)
    .map(([rawDirectiveName, rawDirectiveValue]) => {
      const directiveName = kebabCase(rawDirectiveName);

      let directiveValue;
      if (typeof rawDirectiveValue === 'string') {
        directiveValue = ` ${rawDirectiveValue}`;
      } else if (Array.isArray(rawDirectiveValue)) {
        directiveValue = rawDirectiveValue.join(' ');
      } else if (typeof rawDirectiveValue === 'boolean' && !rawDirectiveValue) {
        return '';
      }

      if (!directiveValue) {
        return directiveName;
      }

      return `${directiveName} ${directiveValue}`;
    })
    .filter(Boolean)
    .join('; ');
};

/**
 * Get a config compatible with Helmet's format
 */
const getContentSecurityPolicyConfig = () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      reportOnly: false,
      directives: generateDirectives({
        blockAllMixedContent: false,
        scriptSrc: [UNSAFE_INLINE, UNSAFE_EVAL], // For NextJS scripts
      }),
    };
  } else if (process.env.NODE_ENV === 'production') {
    return {
      reportOnly: false,
      directives: generateDirectives({
        imgSrc: [
          'opencollective-production.s3.us-west-1.amazonaws.com',
          'opencollective-production.s3-us-west-1.amazonaws.com',
        ],
      }),
    };
  }
};

const getCSPHeader = () => {
  const config = getContentSecurityPolicyConfig();
  if (config) {
    return {
      key: config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy',
      value: getHeaderValueFromDirectives(config.directives),
    };
  }
};

export { getContentSecurityPolicyConfig, getCSPHeader };
