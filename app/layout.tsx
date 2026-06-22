import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'My Google AI Studio App',
  description: 'My Google AI Studio App',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var originalFetch = window.fetch;
                  var currentFetch = originalFetch;

                  // Safe wrapper to prevent "Illegal invocation" error
                  var wrapFetch = function(fn) {
                    if (typeof fn !== 'function') return fn;
                    return function() {
                      return fn.apply(window, arguments);
                    };
                  };

                  var desc = Object.getOwnPropertyDescriptor(window, 'fetch');
                  if (!desc || desc.configurable) {
                    Object.defineProperty(window, 'fetch', {
                      configurable: true,
                      enumerable: true,
                      get: function() {
                        return wrapFetch(currentFetch);
                      },
                      set: function(val) {
                        currentFetch = val;
                      }
                    });
                  } else {
                    var protoDesc = Object.getOwnPropertyDescriptor(Window.prototype, 'fetch');
                    if (protoDesc && protoDesc.configurable) {
                      Object.defineProperty(Window.prototype, 'fetch', {
                        configurable: true,
                        enumerable: true,
                        get: function() {
                          return wrapFetch(currentFetch);
                        },
                        set: function(val) {
                          currentFetch = val;
                        }
                      });
                    }
                  }
                } catch (e) {
                  console.warn('Sandbox fetch polyfill error:', e);
                }
              })();
            `
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
