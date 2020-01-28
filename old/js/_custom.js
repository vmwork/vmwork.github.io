'use strict'
var toggleButton = document.querySelector('.burger-button');
var toggleBurger = document.querySelector('.head-nav__burger');

var activeMenu = document.querySelector('.head-nav-content');

var toggleButtonHandler = function(){
	toggleBurger.classList.toggle('show-menu');
	activeMenu.classList.toggle('activete-menu');
}

toggleButton.addEventListener('click', toggleButtonHandler);





 var multiItemSlider = (function () {

      function _isElementVisible(element) {
        var rect = element.getBoundingClientRect(),
          vWidth = window.innerWidth || doc.documentElement.clientWidth,
          vHeight = window.innerHeight || doc.documentElement.clientHeight,
          elemFromPoint = function (x, y) { return document.elementFromPoint(x, y) };
        if (rect.right < 0 || rect.bottom < 0
          || rect.left > vWidth || rect.top > vHeight)
          return false;
        return (
          element.contains(elemFromPoint(rect.left, rect.top))
          || element.contains(elemFromPoint(rect.right, rect.top))
          || element.contains(elemFromPoint(rect.right, rect.bottom))
          || element.contains(elemFromPoint(rect.left, rect.bottom))
        );
      }

      return function (selector, config) {
        var
          _mainElement = document.querySelector(selector), // основный элемент блока
          _sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
          _sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
          _sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
          _sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
          _sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
          _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
          _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента    
          _positionLeftItem = 0, // позиция левого активного элемента
          _transform = 0, // значение транфсофрмации .slider_wrapper
          _step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
          _items = [], // массив элементов
          _interval = 0,
          _html = _mainElement.innerHTML,
          _states = [
            { active: false, minWidth: 0, count: 1 },
            { active: false, minWidth: 980, count: 2 }
          ],
          _config = {
            isCycling: false, // автоматическая смена слайдов
            direction: 'right', // направление смены слайдов
            interval: 5000, // интервал между автоматической сменой слайдов
            pause: true // устанавливать ли паузу при поднесении курсора к слайдеру
          };

        for (var key in config) {
          if (key in _config) {
            _config[key] = config[key];
          }
        }

        // наполнение массива _items
        _sliderItems.forEach(function (item, index) {
          _items.push({ item: item, position: index, transform: 0 });
        });

        var _setActive = function () {
          var _index = 0;
          var width = parseFloat(document.body.clientWidth);
          _states.forEach(function (item, index, arr) {
            _states[index].active = false;
            if (width >= _states[index].minWidth)
              _index = index;
          });
          _states[_index].active = true;
        }

        var _getActive = function () {
          var _index;
          _states.forEach(function (item, index, arr) {
            if (_states[index].active) {
              _index = index;
            }
          });
          return _index;
        }

        var position = {
          getItemMin: function () {
            var indexItem = 0;
            _items.forEach(function (item, index) {
              if (item.position < _items[indexItem].position) {
                indexItem = index;
              }
            });
            return indexItem;
          },
          getItemMax: function () {
            var indexItem = 0;
            _items.forEach(function (item, index) {
              if (item.position > _items[indexItem].position) {
                indexItem = index;
              }
            });
            return indexItem;
          },
          getMin: function () {
            return _items[position.getItemMin()].position;
          },
          getMax: function () {
            return _items[position.getItemMax()].position;
          }
        }

        var _transformItem = function (direction) {
          var nextItem;
          if (!_isElementVisible(_mainElement)) {
            return;
          }
          if (direction === 'right') {
            _positionLeftItem++;
            if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
              nextItem = position.getItemMin();
              _items[nextItem].position = position.getMax() + 1;
              _items[nextItem].transform += _items.length * 100;
              _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
            }
            _transform -= _step;
          }
          if (direction === 'left') {
            _positionLeftItem--;
            if (_positionLeftItem < position.getMin()) {
              nextItem = position.getItemMax();
              _items[nextItem].position = position.getMin() - 1;
              _items[nextItem].transform -= _items.length * 100;
              _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
            }
            _transform += _step;
          }
          _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
        }

        var _cycle = function (direction) {
          if (!_config.isCycling) {
            return;
          }
          _interval = setInterval(function () {
            _transformItem(direction);
          }, _config.interval);
        }

        // обработчик события click для кнопок "назад" и "вперед"
        var _controlClick = function (e) {
          if (e.target.classList.contains('slider__control')) {
            e.preventDefault();
            var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
            _transformItem(direction);
            clearInterval(_interval);
            _cycle(_config.direction);
          }
        };

        // обработка события изменения видимости страницы
        var _handleVisibilityChange = function () {
          if (document.visibilityState === "hidden") {
            clearInterval(_interval);
          } else {
            clearInterval(_interval);
            _cycle(_config.direction);
          }
        }

        var _refresh = function () {
          clearInterval(_interval);
          _mainElement.innerHTML = _html;
          _sliderWrapper = _mainElement.querySelector('.slider__wrapper');
          _sliderItems = _mainElement.querySelectorAll('.slider__item');
          _sliderControls = _mainElement.querySelectorAll('.slider__control');
          _sliderControlLeft = _mainElement.querySelector('.slider__control_left');
          _sliderControlRight = _mainElement.querySelector('.slider__control_right');
          _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width);
          _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);
          _positionLeftItem = 0;
          _transform = 0;
          _step = _itemWidth / _wrapperWidth * 100;
          _items = [];
          _sliderItems.forEach(function (item, index) {
            _items.push({ item: item, position: index, transform: 0 });
          });
        }

        var _setUpListeners = function () {
          _mainElement.addEventListener('click', _controlClick);
          if (_config.pause && _config.isCycling) {
            _mainElement.addEventListener('mouseenter', function () {
              clearInterval(_interval);
            });
            _mainElement.addEventListener('mouseleave', function () {
              clearInterval(_interval);
              _cycle(_config.direction);
            });
          }
          document.addEventListener('visibilitychange', _handleVisibilityChange, false);
          window.addEventListener('resize', function () {
            var
              _index = 0,
              width = parseFloat(document.body.clientWidth);
            _states.forEach(function (item, index, arr) {
              if (width >= _states[index].minWidth)
                _index = index;
            });
            if (_index !== _getActive()) {
              _setActive();
              _refresh();
            }
          });
        }

        // инициализация
        _setUpListeners();
        if (document.visibilityState === "visible") {
          _cycle(_config.direction);
        }
        _setActive();

        return {
          right: function () { // метод right
            _transformItem('right');
          },
          left: function () { // метод left
            _transformItem('left');
          },
          stop: function () { // метод stop
            _config.isCycling = false;
            clearInterval(_interval);
          },
          cycle: function () { // метод cycle 
            _config.isCycling = true;
            clearInterval(_interval);
            _cycle();
          }
        }

      }
    }());

    var slider = multiItemSlider('.slider', {
      isCycling: true
    });

    var studyProgrammButton  = document.querySelector('.study-programm__button');
    var verticalButton = studyProgrammButton.querySelector('.study-programm__button--vertical');
    var horizontalButton = studyProgrammButton.querySelector('.study-programm__button--horizontal');
    var  studyList1 = document.querySelector('.study-programm__list-1');
    var  studyList2 = document.querySelector('.study-programm__list-2');
 console.log(studyList2)

    var verticalButtonHandler = function(){
      verticalButton.classList.toggle('horizontal-mod');
      horizontalButton.classList.toggle('vertical-mod');
       studyList1.classList.toggle('hidden');
       studyList2.classList.toggle('hidden');

    }

    var gorizontalButtonHandler = function(){
      horizontalButton.classList.toggle('vertical-mod');
      verticalButton.classList.toggle('horizontal-mod');
         studyList1.classList.toggle('hidden');
       studyList2.classList.toggle('hidden');
      

    }
    verticalButton.addEventListener('click',verticalButtonHandler);

    horizontalButton.addEventListener('click', gorizontalButtonHandler)







function currentYPosition() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
}


function elmYPosition(eID) {
    var elm = document.getElementById(eID);
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    } return y;
}


const anchors = document.querySelectorAll('a[href*="#"]')

for (let anchor of anchors) {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    
    const blockID = anchor.getAttribute('href').substr(1)
    
    document.getElementById(blockID).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })
}



      var slideShow = (function () {
        return function (selector, config) {
          var
            _slider = document.querySelector(selector), // основный элемент блока
            _sliderContainer = _slider.querySelector('.gallery-slider__items'), // контейнер для .gallery-slider-item
            _sliderItems = _slider.querySelectorAll('.gallery-slider__item'), // коллекция .gallery-slider-item
            _sliderControls = _slider.querySelectorAll('.gallery-slider__control'), // элементы управления
            _currentPosition = 0, // позиция левого активного элемента
            _transformValue = 0, // значение транфсофрмации .gallery-slider_wrapper
            _transformStep = 100, // величина шага (для трансформации)
            _itemsArray = [], // массив элементов
            _timerId,
            _indicatorItems,
            _indicatorIndex = 0,
            _indicatorIndexMax = _sliderItems.length - 1,
            _stepTouch = 50,
            _config = {
              isAutoplay: false, // автоматическая смена слайдов
              directionAutoplay: 'next', // направление смены слайдов
              delayAutoplay: 5000, // интервал между автоматической сменой слайдов
              isPauseOnHover: true // устанавливать ли паузу при поднесении курсора к слайдеру
            };

          // настройка конфигурации слайдера в зависимости от полученных ключей
          for (var key in config) {
            if (key in _config) {
              _config[key] = config[key];
            }
          }

          // наполнение массива _itemsArray
          for (var i = 0, length = _sliderItems.length; i < length; i++) {
            _itemsArray.push({ item: _sliderItems[i], position: i, transform: 0 });
          }

          // переменная position содержит методы с помощью которой можно получить минимальный и максимальный индекс элемента, а также соответствующему этому индексу позицию
          var position = {
            getItemIndex: function (mode) {
              var index = 0;
              for (var i = 0, length = _itemsArray.length; i < length; i++) {
                if ((_itemsArray[i].position < _itemsArray[index].position && mode === 'min') || (_itemsArray[i].position > _itemsArray[index].position && mode === 'max')) {
                  index = i;
                }
              }
              return index;
            },
            getItemPosition: function (mode) {
              return _itemsArray[position.getItemIndex(mode)].position;
            }
          };

          // функция, выполняющая смену слайда в указанном направлении
          var _move = function (direction) {
            var nextItem, currentIndicator = _indicatorIndex;;
            if (direction === 'next') {
              _currentPosition++;
              if (_currentPosition > position.getItemPosition('max')) {
                nextItem = position.getItemIndex('min');
                _itemsArray[nextItem].position = position.getItemPosition('max') + 1;
                _itemsArray[nextItem].transform += _itemsArray.length * 100;
                _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
              }
              _transformValue -= _transformStep;
              _indicatorIndex = _indicatorIndex + 1;
              if (_indicatorIndex > _indicatorIndexMax) {
                _indicatorIndex = 0;
              }
            } else {
              _currentPosition--;
              if (_currentPosition < position.getItemPosition('min')) {
                nextItem = position.getItemIndex('max');
                _itemsArray[nextItem].position = position.getItemPosition('min') - 1;
                _itemsArray[nextItem].transform -= _itemsArray.length * 100;
                _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
              }
              _transformValue += _transformStep;
              _indicatorIndex = _indicatorIndex - 1;
              if (_indicatorIndex < 0) {
                _indicatorIndex = _indicatorIndexMax;
              }
            }
            _sliderContainer.style.transform = 'translateX(' + _transformValue + '%)';
            _indicatorItems[currentIndicator].classList.remove('active');
            _indicatorItems[_indicatorIndex].classList.add('active');
          };

          // функция, осуществляющая переход к слайду по его порядковому номеру
          var _moveTo = function (index) {
            var i = 0, direction = (index > _indicatorIndex) ? 'next' : 'prev';
            while (index !== _indicatorIndex && i <= _indicatorIndexMax) {
              _move(direction);
              i++;
            }
          };

          // функция для запуска автоматической смены слайдов через промежутки времени
          var _startAutoplay = function () {
            if (!_config.isAutoplay) {
              return;
            }
            _stopAutoplay();
            _timerId = setInterval(function () {
              _move(_config.directionAutoplay);
            }, _config.delayAutoplay);
          };

          // функция, отключающая автоматическую смену слайдов
          var _stopAutoplay = function () {
            clearInterval(_timerId);
          };

          // функция, добавляющая индикаторы к слайдеру
          var _addIndicators = function () {
            var indicatorsContainer = document.createElement('ol');
            indicatorsContainer.classList.add('gallery-slider__indicators');
            for (var i = 0, length = _sliderItems.length; i < length; i++) {
              var sliderIndicatorsItem = document.createElement('li');
              if (i === 0) {
                sliderIndicatorsItem.classList.add('active');
              }
              sliderIndicatorsItem.setAttribute("data-slide-to", i);
              indicatorsContainer.appendChild(sliderIndicatorsItem);
            }
            _slider.appendChild(indicatorsContainer);
            _indicatorItems = _slider.querySelectorAll('.gallery-slider__indicators > li')
          };

          var _isTouchDevice = function () {
            return !!('ontouchstart' in window || navigator.maxTouchPoints);
          };

          // функция, осуществляющая установку обработчиков для событий 
          var _setUpListeners = function () {
            var _startX = 0;
            if (_isTouchDevice()) {
              _slider.addEventListener('touchstart', function (e) {
                _startX = e.changedTouches[0].clientX;
                _startAutoplay();
              });
              _slider.addEventListener('touchend', function (e) {
                var
                  _endX = e.changedTouches[0].clientX,
                  _deltaX = _endX - _startX;
                if (_deltaX > _stepTouch) {
                  _move('prev');
                } else if (_deltaX < -_stepTouch) {
                  _move('next');
                }
                _startAutoplay();
              });
            } else {
              for (var i = 0, length = _sliderControls.length; i < length; i++) {
                _sliderControls[i].classList.add('gallery-slider__control_show');
              }
            }
            _slider.addEventListener('click', function (e) {
              if (e.target.classList.contains('gallery-slider__control')) {
                e.preventDefault();
                _move(e.target.classList.contains('gallery-slider__control_next') ? 'next' : 'prev');
                _startAutoplay();
              } else if (e.target.getAttribute('data-slide-to')) {
                e.preventDefault();
                _moveTo(parseInt(e.target.getAttribute('data-slide-to')));
                _startAutoplay();
              }
            });
            document.addEventListener('visibilitychange', function () {
              if (document.visibilityState === "hidden") {
                _stopAutoplay();
              } else {
                _startAutoplay();
              }
            }, false);
            if (_config.isPauseOnHover && _config.isAutoplay) {
              _slider.addEventListener('mouseenter', function () {
                _stopAutoplay();
              });
              _slider.addEventListener('mouseleave', function () {
                _startAutoplay();
              });
            }
          };

          // добавляем индикаторы к слайдеру
          _addIndicators();
          // установливаем обработчики для событий
          _setUpListeners();
          // запускаем автоматическую смену слайдов, если установлен соответствующий ключ
          _startAutoplay();

          return {
            // метод слайдера для перехода к следующему слайду
            next: function () {
              _move('next');
            },
            // метод слайдера для перехода к предыдущему слайду          
            left: function () {
              _move('prev');
            },
            // метод отключающий автоматическую смену слайдов
            stop: function () {
              _config.isAutoplay = false;
              _stopAutoplay();
            },
            // метод запускающий автоматическую смену слайдов
            cycle: function () {
              _config.isAutoplay = true;
              _startAutoplay();
            }
          }
        }
      }());

      slideShow('.gallery-slider', {
        isAutoplay: true
      });


 $.jMaskGlobals = {translation: {
                'n': {pattern: /\d/},
            }
        };
        $('.phone-mask').mask('+38 (nnn)-nnn-nnnn').val('+38 (___) ___ - __ - __');
