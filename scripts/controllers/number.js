angular.module('puzzle', ['angular-gestures'])
    .config(function (hammerDefaultOptsProvider) {
        hammerDefaultOptsProvider.set({
            recognizers: [
                [Hammer.Swipe,{ direction: Hammer.DIRECTION_ALL }]
            ]
        });
    })
    .controller('NumberCtrl', ['$scope', '$timeout', function ($scope, $timeout) {


        $scope.shortCut = function (event) {
            var ARROW_KEY = {};
            ARROW_KEY[37] = 'moveLeft';
            ARROW_KEY[38] = 'moveTop';
            ARROW_KEY[39] = 'moveRight';
            ARROW_KEY[40] = 'moveDown';
            var keyPressed = ARROW_KEY[event.keyCode];
            if (keyPressed === undefined) {
                return;
            }
            event.preventDefault();
            simulateClick(keyPressed);
        };

        var simulateClick =function(direction){
            var possibleMovement = $scope.getMovable();
            var toClick = possibleMovement[direction];
            $scope.pieceClick(toClick);
            event.preventDefault();
        };

        $scope.swipeUP = function(){
            simulateClick('moveDown');
        };

        $scope.swipeDown = function(){
            simulateClick('moveTop');
        };

        $scope.swipeRight = function(){
            simulateClick('moveLeft');
        };

        $scope.swipeLeft = function(){
            simulateClick('moveRight');
        };

        $scope.testSwipe= function(event){
            console.log(event);
        };


        $scope.size = 4;
        $scope.boardIndex = [];
        $scope.board = [];

        $scope.counter = 0;

        $scope.boardMax = function () {
            return $scope.size * $scope.size;
        };

        $scope.boardChanged = function (from, to) {
            $scope.board[from].position = to;
        };

        $scope.init = function () {
            $scope.boardIndex = [];

            for (var i = 1; i < $scope.boardMax(); i++) {
                $scope.boardIndex.push(i);
                $scope.board.push({position: i - 1, value: i})
            }

            $scope.boardIndex.push(0);
            $scope.board.push({ position: $scope.boardMax() - 1, value: 0});


        }


        $scope.finished = function () {
            if ($scope.boardIndex.length < $scope.boardMax()) {
                return false;
            }

            var result = true;
            for (var i = 0; i <= $scope.boardMax() - 2; i++) {
                if ($scope.boardIndex[i] != i + 1) {
                    result = false;
                }
            }

            if (result)
                $scope.stop();

            return result;
        }


        $scope.randomize = function () {
            if (!$scope.initialized()) {
                $scope.init();
            }
            $scope.counter = 0;

            arrayHelper.fisherYates($scope.boardIndex);
            $scope.stop();
            myTimeout = $timeout($scope.onTimeout, 1000);

        }

        var myTimeout;
        $scope.pieceClick = function (pos) {
            if (pos < $scope.boardMax() && pieceMovable(pos)) {
                var zeroP = zeroPosition($scope.boardIndex);

                $scope.boardChanged($scope.boardIndex[pos] - 1, zeroP);
                $scope.boardChanged($scope.boardMax() - 1, pos);


                $scope.boardIndex[zeroP] = $scope.boardIndex[pos];


                $scope.boardIndex[pos] = 0;




            }
        }


        $scope.pieceEmpty = function (pos) {
            return $scope.boardIndex[pos] == 0;
        }


        var zeroPosition = function (arr) {
            for (var pos = 0; pos < arr.length; pos++) {
                if (arr[pos] === 0) {
                    return pos;
                }
            }
        }


        var pieceMovable = function (pos) {
            return (((pos) % $scope.size) && pieceEmpty(pos - 1) ) ||
                ((  (pos + 1) % $scope.size) && pieceEmpty(pos + 1) ) ||
                pieceEmpty(arrayHelper.addRow($scope.size, pos, -1)) ||
                pieceEmpty(arrayHelper.addRow($scope.size, pos, 1));
        };

        $scope.getMovable = function () {
            var movementPossible = [];
            var zeroP = zeroPosition($scope.boardIndex);

            var obj = {};
            var moveRightNumber = zeroP + 1;
            var moveRight = (moveRightNumber <= 15) && ((moveRightNumber) % $scope.size) != 0 && pieceEmpty(moveRightNumber - 1);
            if (moveRight) {
                movementPossible.push(moveRightNumber);
                obj.moveRight = moveRightNumber;
            }

            var moveLeftNumber = zeroP - 1;
            var moveLeft = (moveLeftNumber >= 0 ) && (  (moveLeftNumber + 1) % $scope.size) && pieceEmpty(moveLeftNumber + 1);
            if (moveLeft) {
                movementPossible.push(moveLeftNumber);
                obj.moveLeft = moveLeftNumber;
            }

            var moveTopNumber = arrayHelper.addRow($scope.size, zeroP, -1);
            var moveTop = moveTopNumber >= 0;
            if (moveTop) {
                movementPossible.push(moveTopNumber);
                obj.moveTop = moveTopNumber;
            }

            var moveDownNumber = arrayHelper.addRow($scope.size, zeroP, +1)
            var moveDown = moveDownNumber <= 15;
            if (moveDown) {
                movementPossible.push(moveDownNumber);
                obj.moveDown = moveDownNumber;
            };

//            var randomNumber = Math.floor(Math.random() * ( movementPossible.length ));
//            $scope.pieceClick(movementPossible[randomNumber]);
            return obj;
        };

        var pieceEmpty = function (pos) {
            return (pos >= 0 &&
                pos < $scope.boardMax() &&
                $scope.boardIndex[pos] === 0);
        };


        $scope.initialized = function () {
            return ($scope.boardIndex.length == $scope.size * $scope.size);
        };

        $scope.onTimeout = function () {
            $scope.counter++;
            myTimeout = $timeout($scope.onTimeout, 1000);
        };


        $scope.stop = function () {
            $timeout.cancel(myTimeout);
        };


//        $scope.shuffleAnimation= function (){
//            var saved = $scope.board.slice(0);
//
//            var indexToShuffle = [];
//            var index = 0;
//            indexToShuffle.push(index);
//            for( var i = 0;i< $scope.size-1; i++ ){
//                index ++
//                indexToShuffle.push(index);
//            }
//            for(var i = 0;i< $scope.size -1; i++ ){
//                index =index + $scope.size;
//                indexToShuffle.push(index);
//            }
//            for( var i = 0;i< $scope.size -1; i++ ){
//                index --
//                indexToShuffle.push(index);
//            }
//            for(var i = 0;i< $scope.size -1; i++ ){
//                index = index - $scope.size;
//                indexToShuffle.push(index);
//            }
//
//            var stop = 50;
//            var iterator = 0;
//            var interval =setInterval(function(){
//                var temp = iterator % indexToShuffle.length;
//                var index =indexToShuffle[temp];
//                $scope.board[index].position --;
//                iterator ++ ;
//                if(iterator == stop) {
//                    setTimeout(function(){
//                        clearInterval(interval);
//                        $scope.board = saved;
//                    },1000);
//                }
//            },100)
//
//
//
//
//        };

        var arrayHelper = {
            addRow: function (arrSize, pos, count) {
                return pos + (count * arrSize);
            },
            fisherYates: function (arr) {
                var i = arr.length ;
                if (i == 0) return false;
                while (--i) {

                    var j = Math.floor(Math.random() * ( i + 1 ));
                    var temp = arr[j];
                    arr[j] = arr[i];
                    arr[i] = temp;

                    temp = $scope.board[ getIndex(arr[i]) ].position;
                    $scope.board[ getIndex(arr[i]) ].position = $scope.board[getIndex(arr[j]) ].position;
                    $scope.board[ getIndex(arr[j]) ].position = temp;
                }

                function getIndex(i) {
                    i--;
                    if (i < 0) {
                        i = $scope.boardMax() - 1;
                    }
                    return i;

                }

            }

        }


    }]);