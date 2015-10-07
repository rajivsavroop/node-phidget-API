var Phidget = require('../../../../phidgetapi.js').Phidget;

describe(
    'Phidget spec',
    function(){
        var phidgetCore = new Phidget();
        console.log('label ',phidgetCore.label);

        it(
            'Verifies phidget data when phidget is ready',
            function(done){

                console.log('in phi test');

                phidgetCore.on(
                   'log',
                   giveLog
                )

                phidgetCore.on(
                    'attached',
                    checkAttachDevice
                );

                phidgetCore.on(
                    'phidgetReady',
                    phidgetIsReady
                );

                phidgetCore.on(
                    'error',
                    errorHandler
                );

                phidgetCore.on(
                    'connected',
                    checkConnect
                );

                phidgetCore.on(
                    'data',
                    function(data){
                        console.log('this is data yayayayayay',data);
                    }
                );


                function checkAttachDevice(data){
                    console.log('yeah im attached',data);
                    expect(data.Status).toBe('Attached');
                    expect(data.value).toBe('Attached');
                }

                function checkConnect(){
                    console.log('I am connected');
                    phidgetCore.removeListener(
                        'connected',
                        checkConnect
                    );
                }

                function giveLog(data){
                    expect(data).toBeDefined();
                }

                function errorHandler(err){
                    phidgetCore.removeListener(
                        'error',
                        errorHandler
                    );
                    expect(err).toBe(false);
                    done();
                }

                function phidgetIsReady(){
                    console.log('Phidget is ready to be tested');
                    testCase(phidgetCore.data);
                 }

                function testCase(){
                    phidgetCore.removeListener(
                        'attached',
                        checkAttachDevice
                    );

                    phidgetCore.removeListener(
                        'phidgetReady',
                        phidgetIsReady
                    );
                    expect(Number(phidgetCore.data.serial.length)).toBeGreaterThan(0);
                    expect(phidgetCore.data.board).toBeDefined();
                    done();
                }

                phidgetCore.connect(
                    {
                        type: 'PhidgetInterfaceKit',
                        rawLog: true
                    }
                );
            }
        );

        it(
            'Verifies the label event',
            function(done){

                phidgetCore.on(
                    'changed',
                    testCaseLabel
                );

                phidgetCore.on(
                    'error',
                    errorHandler
                );
                console.log('this is the label for phidget', phidgetCore.label);

                var label = phidgetCore.label;

                setTimeout(
                    function(){
                        phidgetCore.label = '44rdt';
                    }, 100
                );

                function errorHandler(err){
                     phidgetCore.removeListener(
                        'error',
                        errorHandler
                    );
                    expect(err).toBe(false);
                    done();
                }

                function testCaseLabel(data){
                    if(data.key != 'Label'){
                       return;
                    }
                    phidgetCore.removeListener(
                        'changed',
                        testCaseLabel
                    );


                    expect(phidgetCore.label).toBe('44rdt');
                    phidgetCore.label = label;
                    console.log('ending before')
                    done();
                }            }
        );

        it(
            'Verifies the rate event',
            function(done){
                phidgetCore.on(
                    'error',
                    errorHandler
                );

                phidgetCore.on(
                    'changed',
                    testCaseRate
                );

                var rate = phidgetCore.rate;

                phidgetCore.rate = 4;

                function errorHandler(err){
                    phidgetCore.removeListener(
                        'error',
                        errorHandler
                    );
                    expect(err).toBe(false);
                    done();
                }

                function testCaseRate(data){
                    if(data.key != 'rate'){
                       return;
                    }
                    phidgetCore.removeListener(
                        'changed',
                        testCaseRate
                    );

                    expect(phidgetCore.rate).toBe(4);//rate rounds
                    phidgetCore.rate = rate;
                    done();
                }
            }
        );

        it(
            'Verify output is initially off(0)',
            function(done){

                phidgetCore.on(
                    'changed',
                    testSet
                );

                console.log('in set test before timeout', phidgetCore.data.Output[0]);

                if (Number(phidgetCore.data.Output[0]) == 0){
                    done();
                }

                else if (Number(phidgetCore.data.Output[0]) !== 0){
                    setTimeout(
                        function(){
                            phidgetCore.set(
                                {
                                    type:'Output',
                                    key:Number(0).toString(),
                                    value:Number(0).toString()
                                }
                            );
                            return;
                        },1500
                    );
                }


                function testSet(data){
                     phidgetCore.removeListener(
                        'changed',
                        testSet
                    );
                    console.log(data);
                    expect(phidgetCore.data.Output[0]).toBe('0');
                    done();
                }
            }
        );

        it(
            'Verifies Set function and changed event',
            function(done){
                var orignalOutputValue = '0';
                var changedValue = '1';
                expect(phidgetCore.data.Output[0]).toBe(orignalOutputValue);

                if(phidgetCore.data.Output[0]!==orignalOutputValue){
                    done();
                }

                phidgetCore.on(
                    'error',
                    errorHandler
                );

                phidgetCore.on(
                    'changed',
                    testCaseOutput
                );


                function errorHandler(err){
                    phidgetCore.removeListener(
                        'error',
                        errorHandler
                    );
                    expect(err).toBe(false);
                    done();
                }

                function testCaseOutput(data){

                    if(data.type !== 'Output'){
                       return;
                    }

                    console.log('in test case output');

                    phidgetCore.removeListener(
                        'changed',
                        testCaseOutput
                    );

                    phidgetCore.on(
                        'changed',
                        testChangedValue
                    );

                    console.log('Output 1',data);

                    if(!phidgetCore.data.Output){
                        console.log('no output, waiting...');
                    }

                    expect(Number(phidgetCore.data.Output[0])).toBe(Number(changedValue));

                    setTimeout(
                        function(){
                          console.log('seetin again to orignal');
                            phidgetCore.set(
                                {
                                    type:'Output',
                                    key:Number(0).toString(),
                                    value:Number(orignalOutputValue).toString()
                                }
                            );
                        }, 2000
                        //phidgetCore.rate*10
                    );
                }

                function testChangedValue(data){
                    console.log('Output 2',data);

                    console.log('in test changed value');

                    phidgetCore.removeListener(
                        'changed',
                        testChangedValue
                    );


                    if(data.type != 'Output'){
                       return;
                    }

                    if(!phidgetCore.data.Output){
                        console.log('no output, waiting...');
                    }

                    expect(Number(phidgetCore.data.Output[0])).toBe(Number(orignalOutputValue));
                    done();
                }

                setTimeout(
                    function(){
                        phidgetCore.set(
                            {
                                type:'Output',
                                key:Number(0).toString(),
                                value:Number(1).toString()
                            }
                        );
                    },1500
                );
            }
        );

        it(
            'Verifies Phidget detached event',
            function(done){
                console.log('in Detach test');
                phidgetCore.on(
                    'error',
                    errorHandler
                );

                phidgetCore.on(
                    'detached',
                    checkDetachDevice
                );

                function errorHandler(err){
                    phidgetCore.removeListener(
                        'error',
                        errorHandler
                    );
                    expect(err).toBe(false);
                    done();
                }

                function checkDetachDevice(data){
                    phidgetCore.removeListener(
                        'detached',
                        checkDetachDevice
                    );

                    console.log('in detach test');
                    expect(data.Status).toBe('Detached');
                    expect(data.value).toBe('Detached');
                    done();
                }
            }
        );

        it(
            'Verifies the disconnected event and quit function',
            function(done){

                phidgetCore.on(
                    'error',
                    errorHandler
                );

                phidgetCore.on(
                    'disconnected',
                    checkDisconnectedDevice
                );

                function errorHandler(err){
                    phidgetCore.removeListener(
                        'error',
                        errorHandler
                    );
                    expect(err).toBe(false);
                    done();
                }

                function checkDisconnectedDevice(){

                    phidgetCore.removeListener(
                        'disconnected',
                        checkDisconnectedDevice
                    );
                    console.log('In Disconnected');
                    done();
                }
                phidgetCore.quit();

            }
        );

        it(
            'Verifies log event',
            function(done){
                phidgetCore.on(
                    'log',
                    giveLog
                );

                phidgetCore.on(
                    'error',
                    errorHandler
                );

                function errorHandler(err){
                    phidgetCore.removeListener(
                        'error',
                        errorHandler
                    );
                    expect(err).toBe(false);
                    done();
                }

                function giveLog(data){
                    setTimeout(
                        function(){
                            expect(data).toBeDefined();
                            done();
                        }, 3000
                    );
                }
            }
        );
    }
)

describe(
    'it works',
    function(){
        it(
            'should work',
            function(){
                console.log('hello');
                expect(1+2).toBe(3);
            }
        );
    }
)
