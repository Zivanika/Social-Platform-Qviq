import React, { useEffect, useRef } from 'react';
import BEEImage from '../bee.jpg';

function BEE(props) {
  const innerRef = useRef(null);

  useEffect(() => {
    const inner = innerRef.current;

    let mouse = {
      _x: 0,
      _y: 0,
      x: 0,
      y: 0,
      updatePosition: function (event) {
        var e = event || window.event;
        this.x = e.clientX - this._x;
        this.y = (e.clientY - this._y) * -1;
      },
      setOrigin: function (e) {
        this._x = e.offsetLeft + Math.floor(e.offsetWidth / 2);
        this._y = e.offsetTop + Math.floor(e.offsetHeight / 2);
      },
      show: function (e) {
        return "(" + this.x + "," + this.y + ")";
      },
    };

    mouse.setOrigin(inner);
    let counter = 0;
    let refreshRate = 10;
    let isTimeToUpdate = function () {
      return counter++ % refreshRate === 0;
    };

    let onMouseEnterHandler = function (event) {
      update(event);
    };
    let onMouseLeaveHandler = function (event) {
      inner.style = "";
    };
    let onMouseMoveHandler = function (event) {
      if (isTimeToUpdate()) {
        update(event);
      }
    };

    let update = function (event) {
      mouse.updatePosition(event);
      updateTransformStyle(
        (mouse.y / inner.offsetHeight / 2).toFixed(2),
        (mouse.x / inner.offsetWidth / 2).toFixed(2)
      );
    };

    let updateTransformStyle = function (x, y) {
      let style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
      inner.style.transform = style;
      inner.style.webkitTransform = style;
      inner.style.mozTransform = style;
      inner.style.msTransform = style;
      inner.style.oTransform = style;
    };

    inner.onmousemove = onMouseMoveHandler;
    inner.onmouseenter = onMouseEnterHandler;
    inner.onmouseleave = onMouseLeaveHandler;

    return () => {
      inner.onmousemove = null;
      inner.onmouseenter = null;
      inner.onmouseleave = null;
    };
  }, []);
  return (
    <div id="container" style={{perspective:"15px"}}>
    <div id="inner" ref={innerRef}>
        <div  className='demo-img h-96 m-10 rounded-3xl shadow-lg -translate-x-5' style={{ position: 'relative', perspective: '1000px' }}>
        <img src={props.image?props.image:BEEImage} alt="BEE Image" style={{ borderRadius:"1.5rem",width: '100%', height: '100%', objectFit: 'cover' }} />
        <div className="demo-overlay"></div>
        </div>
    </div>
    </div>
  );
}

export default BEE;
