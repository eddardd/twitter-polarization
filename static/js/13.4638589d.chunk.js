(this["webpackJsonptwitter-polarization"]=this["webpackJsonptwitter-polarization"]||[]).push([[13],{303:function(e,t,n){var r;"undefined"!=typeof self&&self,r=function(e){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(t,n){t.exports=e},function(e,t,n){"use strict";function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&a(e,t)}function a(e,t){return(a=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function c(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=s(e);if(t){var o=s(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return u(this,n)}}function u(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function s(e){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var l=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.Background=t.Parallax=void 0;var f=l(n(0)),g=function(e){i(n,e);var t=c(n);function n(){return o(this,n),t.apply(this,arguments)}return n}(f.default.Component);t.Parallax=g;var d=function(e){i(n,e);var t=c(n);function n(){return o(this,n),t.apply(this,arguments)}return n}(f.default.Component);t.Background=d},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.canUseDOM=t.getNodeHeight=t.isScrolledIntoView=t.getWindowHeight=void 0,t.getWindowHeight=function(e){if(!e)return 0;var t=window,n=document,r=n.documentElement,o=n.getElementsByTagName("body")[0];return t.innerHeight||r.clientHeight||o.clientHeight},t.isScrolledIntoView=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2?arguments[2]:void 0;if(!r)return!1;var o=e.getBoundingClientRect().top-n,i=e.getBoundingClientRect().bottom+n;return o<=t.getWindowHeight(r)&&i>=0},t.getNodeHeight=function(e,n){return e?n&&"clientHeight"in n?n.clientHeight:t.getWindowHeight(e):0},t.canUseDOM=function(){return!("undefined"==typeof window||!window.document||!window.document.createElement)}},function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.Background=t.Parallax=void 0;var o=r(n(4));t.Parallax=o.default;var i=r(n(7));t.Background=i.default},function(e,t,n){"use strict";function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function i(e,t){return(i=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function a(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function c(e){return(c=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var u=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var s=u(n(0)),l=n(1),f=n(5),g=n(2),d=u(n(6)),p={position:"absolute",left:"50%",WebkitTransform:"translate3d(-50%, 0, 0)",transform:"translate3d(-50%, 0, 0)",WebkitTransformStyle:"preserve-3d",WebkitBackfaceVisibility:"hidden",MozBackfaceVisibility:"hidden",MsBackfaceVisibility:"hidden"},h=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&i(e,t)}(n,e);var t=function(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=c(e);if(t){var o=c(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return a(this,n)}}(n);function n(e){var r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),(r=t.call(this,e)).onWindowResize=function(){r.parentHeight=g.getNodeHeight(r.canUseDOM,r.parent),r.updatePosition()},r.onWindowLoad=function(){r.updatePosition()},r.onScroll=function(){if(r.canUseDOM){var e=Date.now();e-r.timestamp>=10&&g.isScrolledIntoView(r.node,100,r.canUseDOM)&&(window.requestAnimationFrame(r.updatePosition),r.timestamp=e)}},r.onContentMount=function(e){r.content=e},r.updatePosition=function(){if(r.content){var e=!1;r.contentHeight=r.content.getBoundingClientRect().height,r.contentWidth=r.node.getBoundingClientRect().width,r.img&&r.img.naturalWidth/r.img.naturalHeight<r.contentWidth/r.getImageHeight()&&(e=!0);var t=f.getRelativePosition(r.node,r.canUseDOM),n=!!r.img,o=r.bg&&r.state.splitChildren.bgChildren.length>0;n&&r.setImagePosition(t,e),o&&r.setBackgroundPosition(t),n||o||r.setState({percentage:t})}},r.state={bgImage:e.bgImage,bgImageSrcSet:e.bgImageSrcSet,bgImageSizes:e.bgImageSizes,imgStyle:p,bgStyle:Object.assign(Object.assign({},p),e.bgStyle),percentage:0,splitChildren:f.getSplitChildren(e)},r.canUseDOM=g.canUseDOM(),r.node=null,r.content=null,r.bgImageLoaded=!1,r.bgImageRef=void 0,r.parent=e.parent,r.parentHeight=g.getNodeHeight(r.canUseDOM,r.parent),r.timestamp=Date.now(),r.isDynamicBlur=f.getHasDynamicBlur(e.blur),r}return function(e,t,n){t&&o(e.prototype,t),n&&o(e,n)}(n,[{key:"componentDidMount",value:function(){var e=this.props.parent,t=this.state,n=t.bgImage,r=t.bgImageSrcSet,o=t.bgImageSizes;this.parent=e||document,this.addListeners(),n?this.loadImage(n,r,o):this.updatePosition()}},{key:"componentDidUpdate",value:function(e){var t=this.props,n=t.parent,r=t.bgImage,o=t.bgImageSrcSet,i=t.bgImageSizes,a=this.state.bgImage;e.parent!==n&&(this.removeListeners(this.parent),this.parent=n,n&&this.addListeners()),this.parentHeight=g.getNodeHeight(this.canUseDOM,this.parent),a!==r&&this.loadImage(r,o,i)}},{key:"componentWillUnmount",value:function(){this.removeListeners(this.parent),this.releaseImage()}},{key:"setBackgroundPosition",value:function(e){var t=this.props,n=t.disabled,r=t.strength,o=Object.assign({},this.state.bgStyle);if(!n){var i="translate3d(-50%, ".concat((r<0?r:0)-r*e,"px, 0)");o.WebkitTransform=i,o.transform=i}this.setState({bgStyle:o,percentage:e})}},{key:"setImagePosition",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=this.props,r=n.disabled,o=n.strength,i=n.blur,a=t?"auto":"".concat(this.getImageHeight(),"px"),c=t?"".concat(this.contentWidth,"px"):"auto",u=Object.assign(Object.assign({},this.state.imgStyle),{height:a,width:c});if(!r){var s=o<0,l=(s?o:0)-o*e,g="translate3d(-50%, ".concat(l,"px, 0)"),d="none";i&&(d="blur(".concat(f.getBlurValue(this.isDynamicBlur,i,e),"px)")),u.WebkitTransform=g,u.transform=g,u.WebkitFilter=d,u.filter=d}this.setState({imgStyle:u,percentage:e})}},{key:"getImageHeight",value:function(){var e=this.props.strength,t=(e<0?2.5:1)*Math.abs(e);return Math.floor(this.contentHeight+t)}},{key:"loadImage",value:function(e,t,n){var r=this;this.releaseImage(),this.bgImageRef=new Image,this.bgImageRef.onload=function(){r.setState({bgImage:e,bgImageSrcSet:t,bgImageSizes:n},(function(){return r.updatePosition()}))},this.bgImageRef.onerror=this.bgImageRef.onload,this.bgImageRef.src=e,this.bgImageRef.srcset=t||"",this.bgImageRef.sizes=n||""}},{key:"releaseImage",value:function(){this.bgImageRef&&(this.bgImageRef.onload=null,this.bgImageRef.onerror=null,delete this.bgImageRef)}},{key:"addListeners",value:function(){this.canUseDOM&&this.parent&&(this.parent.addEventListener("scroll",this.onScroll,!1),window.addEventListener("resize",this.onWindowResize,!1),window.addEventListener("load",this.onWindowLoad,!1))}},{key:"removeListeners",value:function(e){this.canUseDOM&&(e&&e.removeEventListener("scroll",this.onScroll,!1),window.removeEventListener("resize",this.onWindowResize,!1),window.removeEventListener("load",this.onWindowLoad,!1))}},{key:"render",value:function(){var e=this,t=this.props,n=t.className,r=t.style,o=t.bgClassName,i=t.contentClassName,a=t.bgImageAlt,c=t.renderLayer,u=t.bgImageStyle,l=this.state,f=l.bgImage,g=l.bgImageSrcSet,p=l.bgImageSizes,h=l.percentage,b=l.imgStyle,m=l.bgStyle,y=l.splitChildren;return s.default.createElement("div",{className:"react-parallax ".concat(n),style:Object.assign({position:"relative",overflow:"hidden"},r),ref:function(t){e.node=t}},f?s.default.createElement("img",{className:o,src:f,srcSet:g,sizes:p,ref:function(t){e.img=t},alt:a,style:Object.assign(Object.assign({},b),u)}):null,c?c(-(h-1)):null,y.bgChildren.length>0?s.default.createElement("div",{className:"react-parallax-background-children",ref:function(t){e.bg=t},style:m},y.bgChildren):null,s.default.createElement(d.default,{onMount:this.onContentMount,className:i},y.children))}}],[{key:"getDerivedStateFromProps",value:function(e){return{splitChildren:f.getSplitChildren(e)}}}]),n}(l.Parallax);h.defaultProps={bgClassName:"react-parallax-bgimage",bgImageAlt:"",className:"",contentClassName:"",disabled:!1,strength:100},t.default=h},function(e,t,n){"use strict";function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.setBlur=t.getBlurValue=t.getHasDynamicBlur=t.getSplitChildren=t.getRelativePosition=t.getPercentage=void 0;var o=n(0),i=n(2);t.getPercentage=function(e,t,n){return(n-e)/(t-e)||0},t.getRelativePosition=function(e,n){if(!n)return 0;var r=e.getBoundingClientRect(),o=r.top,a=r.height,c=i.getNodeHeight(n),u=a>c?a:c,s=Math.round(o>u?u:o);return t.getPercentage(0,u,s)},t.getSplitChildren=function(e){var t=[],n=o.Children.toArray(e.children);return n.forEach((function(e,r){var o=e;o.type&&o.type.isParallaxBackground&&(t=t.concat(n.splice(r,1)))})),{bgChildren:t,children:n}},t.getHasDynamicBlur=function(e){return"object"===r(e)&&void 0!==e.min&&void 0!==e.max},t.getBlurValue=function(e,t,n){return e?t.min+(1-n)*t.max:t},t.setBlur=function(e,t){e.style.webkitFilter="blur(".concat(t,"px)"),e.style.filter="blur(".concat(t,"px)")}},function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var o=r(n(0));t.default=function(e){var t=e.children,n=e.onMount,r=e.className;return o.default.createElement("div",{ref:function(e){return n(e)},className:r||"react-parallax-content",style:{position:"relative"}},t)}},function(e,t,n){"use strict";function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function a(e,t){return(a=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function c(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var l=s(n(0)),f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&a(e,t)}(n,e);var t=function(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=u(e);if(t){var o=u(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return c(this,n)}}(n);function n(){return o(this,n),t.apply(this,arguments)}return function(e,t,n){t&&i(e.prototype,t),n&&i(e,n)}(n,[{key:"render",value:function(){var e=this.props,t=e.className,n=e.children;return l.default.createElement("div",{className:"react-parallax-background ".concat(t)},n)}}]),n}(n(1).Background);f.defaultProps={className:""},f.isParallaxBackground=!0,t.default=f}])},e.exports=r(n(0))},310:function(e,t,n){"use strict";n.r(t);var r,o=n(108),i=n(4),a=n(5),c=n.p+"static/media/cover.ffe4d6ea.jpg",u=a.b.div(r||(r=Object(i.a)(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100vh;\n  //background-image: url(",");\n  background-repeat: no-repeat;\n  -webkit-background-size: cover;\n  -moz-background-size: cover;\n  -o-background-size: cover;\n  background-size: cover;\n\n  h1,\n  p {\n    color: white;\n    text-align: center;\n    justify-content: center;\n  }\n"])),c),s=n(303),l=n(1);t.default=Object(o.a)()((function(){return Object(l.jsx)(s.Parallax,{bgImage:c,strength:-300,blur:{min:-15,max:15},children:Object(l.jsx)(u,{className:"hero",children:Object(l.jsx)("h1",{children:"Polariza\xe7\xe3o Politica"})})})}))}}]);
//# sourceMappingURL=13.4638589d.chunk.js.map