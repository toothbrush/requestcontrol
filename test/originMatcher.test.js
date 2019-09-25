import test from "ava";
import * as RequestControl from "../src/RequestControl/api";
import { RequestController } from "../src/RequestControl/control";

const controller = () => new RequestController();

test.beforeEach(t => {
    t.context.sameDomainRule = RequestControl.createRule({
        action: "filter",
        pattern: {
            origin: "same-domain"
        }
    });
    t.context.thirdPartyDomainRule = RequestControl.createRule({
        action: "filter",
        pattern: {
            origin: "third-party-domain"
        }
    });
    t.context.sameOriginRule = RequestControl.createRule({
        action: "filter",
        pattern: {
            origin: "same-origin"
        }
    });
    t.context.thirdPartyOriginRule = RequestControl.createRule({
        action: "filter",
        pattern: {
            origin: "third-party-origin"
        }
    });
});

test("Same domain - match", t => {
    let url = "http://foo.com/click?p=240631&a=2314955&g=21407340&url=http%3A%2F%2Fbar.com%2F";
    t.truthy(controller().mark({
        originUrl: "http://foo.com/",
        url: url
    }, t.context.sameDomainRule));
    t.truthy(controller().mark({
        originUrl: "https://foo.com:8000/path.index",
        url: url
    }, t.context.sameDomainRule));
    t.truthy(controller().mark({
        originUrl: "https://user@foo.com:8000/path.index",
        url: url
    }, t.context.sameDomainRule));
    t.truthy(controller().mark({
        originUrl: "https://user:pass@foo.com:8000/path.index",
        url: url
    }, t.context.sameDomainRule));
    t.truthy(controller().mark({
        originUrl: "https://192.0.0.1:8080/path.index",
        url: "http://192.0.0.1:8080"
    }, t.context.sameDomainRule));
    t.truthy(controller().mark({
        originUrl: "https://mail.google.com/path.index",
        url: "http://google.com"
    }, t.context.sameDomainRule));
    t.truthy(controller().mark({
        url: "http://google.com"
    }, t.context.sameDomainRule));
    t.truthy(controller().mark({
        originUrl: "http://google.com",
        url: "data:image/png;base64,iVBORw0KG=="
    }, t.context.sameDomainRule));
});

test("Same domain - no match", t => {
    let url = "http://foo.com/click?p=240631&a=2314955&g=21407340&url=http%3A%2F%2Fbar.com%2F";
    t.falsy(controller().mark({
        originUrl: "http://foo.bar.com/",
        url: url
    }, t.context.sameDomainRule));
    t.falsy(controller().mark({
        originUrl: "https://foo2.com:8000/path.index",
        url: url
    }, t.context.sameDomainRule));
    t.falsy(controller().mark({
        originUrl: "https://user@ab.foo2.com:8000/path.index",
        url: url
    }, t.context.sameDomainRule));
    t.falsy(controller().mark({
        originUrl: "https://user:pass@foo.com.au:8000/path.index",
        url: url
    }, t.context.sameDomainRule));
    t.falsy(controller().mark({
        originUrl: "https://192.0.0.1:8080/path.index",
        url: "http://192.0.0.2:8080"
    }, t.context.sameDomainRule));
    t.falsy(controller().mark({
        originUrl: "https://mail.google.com/path.index",
        url: "http://google.com.abc"
    }, t.context.sameDomainRule));
});

test("Third Party Domain - match", t => {
    let url = "http://foo.com/click?p=240631&a=2314955&g=21407340&url=http%3A%2F%2Fbar.com%2F";
    t.truthy(controller().mark({
        originUrl: "http://foo.bar.com/",
        url: url
    }, t.context.thirdPartyDomainRule));
    t.truthy(controller().mark({
        originUrl: "https://foo2.com:8000/path.index",
        url: url
    }, t.context.thirdPartyDomainRule));
    t.truthy(controller().mark({
        originUrl: "https://user@ab.foo2.com:8000/path.index",
        url: url
    }, t.context.thirdPartyDomainRule));
    t.truthy(controller().mark({
        originUrl: "https://user:pass@foo.com.au:8000/path.index",
        url: url
    }, t.context.thirdPartyDomainRule));
    t.truthy(controller().mark({
        originUrl: "https://192.0.0.1:8080/path.index",
        url: "http://192.0.0.2:8080"
    }, t.context.thirdPartyDomainRule));
    t.truthy(controller().mark({
        originUrl: "https://mail.google.com/path.index",
        url: "http://google.com.abc"
    }, t.context.thirdPartyDomainRule));
});


test("Third Party Domain - no match", t => {
    let url = "http://foo.com/click?p=240631&a=2314955&g=21407340&url=http%3A%2F%2Fbar.com%2F";
    t.falsy(controller().mark({
        originUrl: "http://foo.com/",
        url: url
    }, t.context.thirdPartyDomainRule));
    t.falsy(controller().mark({
        originUrl: "https://foo.com:8000/path.index",
        url: url
    }, t.context.thirdPartyDomainRule));
    t.falsy(controller().mark({
        originUrl: "https://user@foo.com:8000/path.index",
        url: url
    }, t.context.thirdPartyDomainRule));
    t.falsy(controller().mark({
        originUrl: "https://user:pass@foo.com:8000/path.index",
        url: url
    }, t.context.thirdPartyDomainRule));
    t.falsy(controller().mark({
        originUrl: "https://192.0.0.1:8080/path.index",
        url: "http://192.0.0.1:8080"
    }, t.context.thirdPartyDomainRule));
    t.falsy(controller().mark({
        originUrl: "https://mail.google.com/path.index",
        url: "http://google.com"
    }, t.context.thirdPartyDomainRule));
    t.falsy(controller().mark({
        url: "http://google.com"
    }, t.context.thirdPartyDomainRule));
    t.falsy(controller().mark({
        originUrl: "http://google.com",
        url: "data:image/png;base64,iVBORw0KG=="
    }, t.context.thirdPartyDomainRule));
});

test("Same origin - match", t => {
    let url = "http://foo.com/click?p=240631&a=2314955&g=21407340&url=http%3A%2F%2Fbar.com%2F";
    t.truthy(controller().mark({
        originUrl: "http://foo.com/",
        url: url
    }, t.context.sameOriginRule));
    t.truthy(controller().mark({
        originUrl: "http://foo.com/path.index",
        url: url
    }, t.context.sameOriginRule));
    t.truthy(controller().mark({
        originUrl: "http://user@foo.com/path.index",
        url: url
    }, t.context.sameOriginRule));
    t.truthy(controller().mark({
        originUrl: "http://user:pass@foo.com/path.index#hash",
        url: url
    }, t.context.sameOriginRule));
    t.truthy(controller().mark({
        originUrl: "https://192.0.0.1:8080/path.index",
        url: "https://192.0.0.1:8080"
    }, t.context.sameOriginRule));
    t.truthy(controller().mark({
        originUrl: "https://mail.google.com/path.index",
        url: "https://mail.google.com"
    }, t.context.sameOriginRule));
    t.truthy(controller().mark({
        url: "http://google.com"
    }, t.context.sameOriginRule));
});

test("Same origin - no match", t => {
    let url = "http://foo.com/click?p=240631&a=2314955&g=21407340&url=http%3A%2F%2Fbar.com%2F";
    t.falsy(controller().mark({
        originUrl: "http://foo.bar.com/",
        url: url
    }, t.context.sameOriginRule));
    t.falsy(controller().mark({
        originUrl: "https://foo.com/path.index",
        url: url
    }, t.context.sameOriginRule));
    t.falsy(controller().mark({
        originUrl: "http://user@foo.com:8000/path.index",
        url: url
    }, t.context.sameOriginRule));
    t.falsy(controller().mark({
        originUrl: "http://user:pass@ab.foo.com/path.index",
        url: url
    }, t.context.sameOriginRule));
    t.falsy(controller().mark({
        originUrl: "https://192.0.0.1:8080/path.index",
        url: "https://192.0.0.2:8080"
    }, t.context.sameOriginRule));
    t.falsy(controller().mark({
        originUrl: "https://mail.google.com/path.index",
        url: "http://mail.google.com/path.index"
    }, t.context.sameOriginRule));
});


test("Third party origin - match", t => {
    let url = "http://foo.com/click?p=240631&a=2314955&g=21407340&url=http%3A%2F%2Fbar.com%2F";
    t.truthy(controller().mark({
        originUrl: "https://foo.com/",
        url: url
    }, t.context.thirdPartyOriginRule));
    t.truthy(controller().mark({
        originUrl: "http://foo.com:8080/path.index",
        url: url
    }, t.context.thirdPartyOriginRule));
    t.truthy(controller().mark({
        originUrl: "https://user@foo.com/path.index",
        url: url
    }, t.context.thirdPartyOriginRule));
    t.truthy(controller().mark({
        originUrl: "http://user:pass@foo.com:8080/path.index#hash",
        url: url
    }, t.context.thirdPartyOriginRule));
    t.truthy(controller().mark({
        originUrl: "https://192.0.0.1:8080/path.index",
        url: "http://192.0.0.1:8080"
    }, t.context.thirdPartyOriginRule));
    t.truthy(controller().mark({
        originUrl: "https://mail.google.com/path.index",
        url: "http://ab.google.com"
    }, t.context.thirdPartyOriginRule));
    t.truthy(controller().mark({
        originUrl: "https://mail.google.com/path.index",
        url: "http://google.com.au"
    }, t.context.thirdPartyOriginRule));
});

test("Third party origin - no match", t => {
    let url = "http://foo.com/click?p=240631&a=2314955&g=21407340&url=http%3A%2F%2Fbar.com%2F";
    t.falsy(controller().mark({
        originUrl: "http://foo.com/",
        url: url
    }, t.context.thirdPartyOriginRule));
    t.falsy(controller().mark({
        originUrl: "http://foo.com/path.index",
        url: url
    }, t.context.thirdPartyOriginRule));
    t.falsy(controller().mark({
        originUrl: "http://user@foo.com/path.index",
        url: url
    }, t.context.thirdPartyOriginRule));
    t.falsy(controller().mark({
        originUrl: "http://user:pass@foo.com/path.index",
        url: url
    }, t.context.thirdPartyOriginRule));
    t.falsy(controller().mark({
        originUrl: "https://192.0.0.1:8080/path.index",
        url: "https://192.0.0.1:8080"
    }, t.context.thirdPartyOriginRule));
    t.falsy(controller().mark({
        originUrl: "http://mail.google.com/path.index",
        url: "http://mail.google.com/path.index"
    }, t.context.thirdPartyOriginRule));
    t.falsy(controller().mark({
        originUrl: "http://mail.google.com:8080/path.index",
        url: "http://mail.google.com:8080/path.index"
    }, t.context.thirdPartyOriginRule));
    t.falsy(controller().mark({
        url: "http://google.com"
    }, t.context.thirdPartyOriginRule));
});
