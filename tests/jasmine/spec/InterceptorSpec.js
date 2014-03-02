describe('Interceptor Library', function() {
	
	beforeEach(function() {
		this.chromeEventOrder = function(args) {
			onBeforeRequest(args);
			onBeforeSendHeaders(args);
			onSendHeaders(args);
		}
		sinon.stub(chrome.runtime ,'sendMessage');
	});

	it("By Default No request should be returned to Postman.", function() {
		var request = {
			type: 'xmlhttprequest',
			url: 'localhost:8000',
			requestId: '1',
			requestBody: {
			},
			requestHeaders: [
			]
		};
		this.chromeEventOrder(request);
		expect(chrome.runtime.sendMessage.called).toBe(false);
	});

	it("Should Return a request, back to postman.", function() {
		appOptions.isCaptureStateEnabled = true;
		var request = {
			type: 'xmlhttprequest',
			url: 'localhost:8000',
			requestId: '1',
			requestBody: {
			},
			requestHeaders: [
			]
		};

		this.chromeEventOrder(request);

		expect(chrome.runtime.sendMessage.args[0][0]).toBe('POSTMAN');
		expect(chrome.runtime.sendMessage.args[0][1].postmanMessage.reqId).toBe('1');
		expect(chrome.runtime.sendMessage.args[0][1].postmanMessage.request).toBe(request);

		appOptions.isCaptureStateEnabled = false;
	});

	afterEach(function() {
		this.chromeEventOrder = null;
		chrome.runtime.sendMessage.restore();
	});
});