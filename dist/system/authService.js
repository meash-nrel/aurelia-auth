System.register(['aurelia-framework', './authentication', './baseConfig', './oAuth1', './oAuth2', './authUtils', 'spoonx/aurelia-api'], function (_export) {
  'use strict';

  var inject, Authentication, BaseConfig, OAuth1, OAuth2, authUtils, Rest, AuthService;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_authentication) {
      Authentication = _authentication.Authentication;
    }, function (_baseConfig) {
      BaseConfig = _baseConfig.BaseConfig;
    }, function (_oAuth1) {
      OAuth1 = _oAuth1.OAuth1;
    }, function (_oAuth2) {
      OAuth2 = _oAuth2.OAuth2;
    }, function (_authUtils) {
      authUtils = _authUtils['default'];
    }, function (_spoonxAureliaApi) {
      Rest = _spoonxAureliaApi.Rest;
    }],
    execute: function () {
      AuthService = (function () {
        function AuthService(rest, auth, oAuth1, oAuth2, config) {
          _classCallCheck(this, _AuthService);

          this.rest = rest;
          this.auth = auth;
          this.oAuth1 = oAuth1;
          this.oAuth2 = oAuth2;
          this.config = config.current;
        }

        _createClass(AuthService, [{
          key: 'getMe',
          value: function getMe() {
            return this.rest.find(this.auth.getProfileUrl());
          }
        }, {
          key: 'isAuthenticated',
          value: function isAuthenticated() {
            return this.auth.isAuthenticated();
          }
        }, {
          key: 'getTokenPayload',
          value: function getTokenPayload() {
            return this.auth.getPayload();
          }
        }, {
          key: 'signup',
          value: function signup(displayName, email, password) {
            var _this = this;

            var signupUrl = this.auth.getSignupUrl();
            var content;
            if (typeof arguments[0] === 'object') {
              content = arguments[0];
            } else {
              content = {
                'displayName': displayName,
                'email': email,
                'password': password
              };
            }
            return this.rest.post(signupUrl, content).then(function (response) {
              if (_this.config.loginOnSignup) {
                _this.auth.setTokenFromResponse(response);
              } else if (_this.config.signupRedirect) {
                window.location.href = _this.config.signupRedirect;
              }

              return response;
            });
          }
        }, {
          key: 'login',
          value: function login(email, password) {
            var _this2 = this;

            var loginUrl = this.auth.getLoginUrl();
            var content;
            if (typeof arguments[1] !== 'string') {
              content = arguments[0];
            } else {
              content = {
                'email': email,
                'password': password
              };
            }

            return this.rest.post(loginUrl, content).then(function (response) {
              _this2.auth.setTokenFromResponse(response);

              return response;
            })['catch'](function (err) {
              console.dir(err.stack);
            });
          }
        }, {
          key: 'logout',
          value: function logout(redirectUri) {
            return this.auth.logout(redirectUri);
          }
        }, {
          key: 'authenticate',
          value: function authenticate(name, redirect, userData) {
            var _this3 = this;

            var provider = this.oAuth2;
            if (this.config.providers[name].type === '1.0') {
              provider = this.oAuth1;
            }

            return provider.open(this.config.providers[name], userData || {}).then(function (response) {
              _this3.auth.setTokenFromResponse(response, redirect);
              return response;
            });
          }
        }, {
          key: 'unlink',
          value: function unlink(provider) {
            var unlinkUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;

            if (this.config.unlinkMethod === 'get') {
              return this.rest.find(unlinkUrl + provider).then(function (response) {
                return response;
              });
            } else if (this.config.unlinkMethod === 'post') {
              return this.rest.post(unlinkUrl, provider).then(function (response) {
                return response;
              });
            }
          }
        }]);

        var _AuthService = AuthService;
        AuthService = inject(Rest, Authentication, OAuth1, OAuth2, BaseConfig)(AuthService) || AuthService;
        return AuthService;
      })();

      _export('AuthService', AuthService);
    }
  };
});