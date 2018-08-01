# RN-showBigImage
使用方法
<ShowBigImage dismissFunc={this.dismissBigImageClick} //点击图片的func
              imageUrl={this.state.bigImageUrl} //图片的url
              imageX={this.state.bigImageX} //当前点击图片的X
              imageY={this.state.bigImageY} //当前点击图片的Y
              imageWidth= {this.state.imageWidth} //当前点击图片的Width
              imageHeight= {this.state.imageHeight} //当前点击图片的Height
/>

另：获取点击图片的坐标大小（绝对位置）


UIManager.measureInWindow(handle, (x,y,w,h)=>{
            console.log(x);
            console.log(y);
            console.log(w);
            console.log(h);
        });
