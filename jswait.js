if(typeof JSWait == 'undefined'){ var JSWait = new Object(); }

(function(){

	//info
	JSWait.info = new Object();
	JSWait.info.status = {BEGAN:1, WAITING:2, FINISHED:3};
	
	//list
	JSWait.list = new Array();
	
	/**
	 * <function: callAndWait> this method must call the callback method to notify the finish of a cycle
	 * <function: finish> this method is called at the end of execution
	 * <function: whileWait> this method is called in the cycle while it do not get a response, so attention for the cycle speed.
	 * <int: timeCycle> here you can change the speed of cycle. 
	 */
	JSWait.createCycle = function(callAndWait, finish, whileWait, timeCycle)
	{
		var c = new JSWaitCycle(callAndWait, finish, whileWait, timeCycle);
		this.list.push(c);
		c.start();
		return c;
	};
	
	//cycle object
	function JSWaitCycle(callAndWait, finish, whileWait, timeCycle)
	{
		var _callAndWait = callAndWait;
		var _whileWait = whileWait;
		var _finish = finish;
		var _status = JSWait.info.status.BEGAN;
		var _timeCycle = (timeCycle > 0 ? timeCycle : 100);
		var _cycleRef = 0;
		var _initTime = new Date().getTime();
		var _currentTime = _initTime;
		
		this.start = function(){
			_cycleRef = setInterval(function(){
				
				switch(_status){
					case JSWait.info.status.BEGAN:
						if(typeof _callAndWait == 'function')
						{
							_status = JSWait.info.status.WAITING;
							_callAndWait(function(){		
								_status = JSWait.info.status.FINISHED;
							});
						}
					break;
					
					case JSWait.info.status.WAITING:
						if(typeof _whileWait == 'function')
						{
							_whileWait();
						}
					break;
						
					case JSWait.info.status.FINISHED:
						if(typeof _finish == 'function')
						{
							_finish();
						}
						clearInterval(_cycleRef);
					break;
				}
				
			}, _timeCycle);
		};
	}
	
})();