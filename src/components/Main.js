// css
require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

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

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="image-sec">
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
