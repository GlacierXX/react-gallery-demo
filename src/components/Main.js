// css
require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片数据
let imageDatas = require('../data/imageDatas.json');
/*
 * 图片名称转换为图片路径
 * @param imageDatasArr 图片数组
 * @result 包含图片路径的图片数组
 */
imageDatas = (function genImageURL(imageDatasArr) {
  for (let i = 0, j = imageDatasArr.length; i < j; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imgURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);
/*
 * 获取两值之前的随机值
 * @param low 区间最小值
 * @param high 区间最大值
 */
let getRangeRandom = (low, high) => {
  return Math.ceil(Math.random() * (high - low)) + low;
}
/*
 * 获取正负30°之间的随机值
 */
let get30DegRandom = () => {
  return  (Math.random() > 0.5? '': '-') + Math.ceil(30 * Math.random()) + 'deg';
}
// 图片组件
class ImgFigure extends React.Component {
  constructor() {
    super();
    this.handleClick = (e) => {
      if (this.props.arrange.isCenter) {
        this.props.inverse();
      } else {
        this.props.center();
      }
      e.stopPropagation();
      e.preventDefault();
    };
  }
  render() {
    let styleObjet = {};
    if (this.props.arrange.pos) {
      styleObjet = this.props.arrange.pos;
    }
    if (this.props.arrange.rotate) {
      (['WebkitTransform', 'MozTransform', 'msTransform', 'Transform']).forEach((value) => {
        styleObjet[value] = 'rotate(' + this.props.arrange.rotate + ')';
      });
    }
    if (this.props.arrange.isCenter) {
      styleObjet.zIndex = 11;
    }
    let imgFigureClass = this.props.arrange.isInverse? 'img-figure is-inverse': 'img-figure';
    return (
      <figure className={imgFigureClass} style={styleObjet} onClick={this.handleClick}>
        <img src={this.props.data.imgURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    );
  }
}
class ControllerUnit extends React.Component {
  constructor () {
    super();
    this.handleClick = (e) => {
      if (this.props.arrange.isCenter) {
        this.props.inverse();
      } else {
        this.props.center();
      }
      e.preventDefault();
      e.stopPropagation();
    };
  }
  render () {
    let controllerUnitClassName = 'controller-unit';
    if (this.props.arrange.isCenter) {
      controllerUnitClassName += ' is-center';
      if (this.props.arrange.isInverse) {
        controllerUnitClassName += ' is-inverse';
      }
    }
    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}></span>
    );
  }
}
// 入口组件
class AppComponent extends React.Component {
  constructor() {
    // 子类在使用this前需要调用super方法
    super();
    // 定义图片组件位置常量
    this.constant = {
      centerPos: {
        left: 0,
        top: 0
      },
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {
        x: [0, 0],
        topSecY: [0, 0]
      }
    };
    this.state = {
      imgsArrangeArr: []
    };
    /*
     * 翻转图片
     * @param index 图片索引
     */
    this.inverse = (index) => {
      return () => {
        let imgsArrangeArr = this.state.imgsArrangeArr;
        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
      };
    };
    /*
     * 居中图片
     * @param index 图片索引
     */
    this.center = (index) => {
      return () => {
        this.reArrange(index);
      };
    };
    /*
     * 重新布局图片
     * @param centerIndex 指定中间图片
     */
    this.reArrange = (centerIndex) => {
      let imgsArrangeArr = this.state.imgsArrangeArr,
          centerPos = this.constant.centerPos,
          hLeftXPosRange = this.constant.hPosRange.leftSecX,
          hRightXPosRange = this.constant.hPosRange.rightSecX,
          hYPosRange = this.constant.hPosRange.y,
          vXPosRange = this.constant.vPosRange.x,
          vTopYPosRange = this.constant.vPosRange.topSecY;
      // 居中图片信息数组
      let imgsCenterArrangeArr = imgsArrangeArr.splice(centerIndex, 1);
      imgsCenterArrangeArr[0] = {
        pos: centerPos,
        rotate: 0,
        isCenter: true
      };
      // 上侧图片信息数组
      let imgsTopNum = Math.floor(Math.random() * 2),
          topIndex = Math.floor((Math.random() * (imgsArrangeArr.length - imgsTopNum))),
          imgsTopArrangeArr = imgsArrangeArr.splice(topIndex, imgsTopNum);
      imgsTopArrangeArr.forEach(function (pos, index) {
        imgsTopArrangeArr[index] = {
          pos: {
            left: getRangeRandom(vXPosRange[0], vXPosRange[1]),
            top: getRangeRandom(vTopYPosRange[0], vTopYPosRange[1])
          },
          rotate: get30DegRandom(),
          isCenter: false
        }
      });
      // 左右两侧图片信息数组
      for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
        let hPosRangeX = null;
        if (i < k) {
          hPosRangeX = hLeftXPosRange;
        } else {
          hPosRangeX = hRightXPosRange;
        }
        imgsArrangeArr[i] = {
          pos: {
            left: getRangeRandom(hPosRangeX[0], hPosRangeX[1]),
            top: getRangeRandom(hYPosRange[0], hYPosRange[1])
          },
          rotate: get30DegRandom(),
          isCenter: false
        };
      }
      // 信息写回状态数组
      if (imgsTopArrangeArr && imgsTopArrangeArr[0]) {
        imgsArrangeArr.splice(topIndex, 0, imgsTopArrangeArr[0]);
      }
      imgsArrangeArr.splice(centerIndex, 0, imgsCenterArrangeArr[0]);
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }
  }

  componentDidMount() {
    // 舞台大小
    let stageDOM = this.refs.stage,
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
    // 图片大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);
    // 中心位置
    this.constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
    // 水平范围
    this.constant.hPosRange = {
      leftSecX: [-halfImgW, halfStageW - halfImgW * 3],
      rightSecX: [halfStageW + halfImgW, stageW - halfImgW],
      y: [-halfImgH, stageH - halfImgH]
    };
    // 垂直范围
    this.constant.vPosRange = {
      x: [halfStageW - imgW, halfStageW + halfImgW],
      topSecY: [-halfImgH, halfStageH - halfImgH * 3]
    };
    // 布局图片
    this.reArrange(0);
  }
  render() {
    let imgFigures = [],
        controllerUnits = [];
    imageDatas.forEach(function (value, index) {
      // 初始化图片组件状态数组
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        };
      }
      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="image-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
