import React, { Component } from 'react';
import { View } from 'react-native';
import styles from '../styles';
import { MAPX_FILE_PATH } from '../utils';
import { IMG_FILE_PATH } from '../utils';
import {
<<<<<<< HEAD
  MGMapView,
  Dot,
  Image,
  GraphicImage,
=======
  Rect,
  MGMapView,
  Dot,
  PointF,
  Image,
  GraphicImage,
  GraphicText,
>>>>>>> 23b17fd1f7e2657202536e45426fcbe9b8e226c6
} from '@mapgis/mobile-react-native';

export default class MapGraphicImage extends Component {
  static navigationOptions = { title: '坐标添加图像' };
  onGetInstance = mapView => {
    this.mapView = mapView;
    this.openMap();
  };

  openMap = async () => {
    await this.mapView.loadFromFile(MAPX_FILE_PATH);
    var dot = new Dot();
    var center = await dot.createObj(12751000.589636726, 3568000.453292473);
    var image = new Image();
<<<<<<< HEAD
    var img = await image.createObjByLocalPath(IMG_FILE_PATH);
    var gi = new GraphicImage();
    this.graphicImage = await gi.createObj();
=======
    //    var img = await image.createObj("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAuCAYAAACYlx/0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAABgYSURBVHjazJppsF1Xld9/e5/xjm9+Gp4ka7QlW7ZseZRtaBuwmbvipgc3FJ108aEJCZUvqXxIqrpSqXxIdSUBkuoPCU3RGYpA0k2CG7DdGBvwgCdNNki2ZvlJ7z298Q5n3lM+3CthwAbRxdC76tQ999a+p876r73/a63/2uJ//NWj3HL9dnzfwzkHgBCgKoPSBsHgN+PAWoszBmsN2kmsrjBOoq3FWos2FmMM2mi0MlTaIoTAWkNWlEgh8DyPlbU+yuprG3E0adKVYGJiYpcUzMS1xkStXg+rsjR5ni/neX5+dWX5aBTXfpBlSdkeGcUYS1yrsba6grOOJOnh+wFBECI8D4QkS/uAwPNDrIX2yCg3Xb+Lgy8+y/LyEp7ncXn4/AaGw4Fz00KIGd/zQinFTk/KLb7nTUspI9/3TRAEi0qpwPO9JWvtuTCMSul5GGN/qe/i/3oMBuvcmHPuRs/39k+Otu9o1sPrx8dGGvXaDhEGYcv3vFggQouTOOuMcZXSJi+KrQ91e/0LRZG/1Ol1njbGPA0kf68BcA7hnKsD1wF3R4F/V7sxclu72VjfatRHmvUaURQipURIiXUOKcRguzhwzmK0jZTWLdOy0+MTY7uVMu/J8vzTK6trp5cXLz0ihPjvxppT1trfNADi8s2Es3aTxN0c+PKOyI/uieNgT6NeC1v1GnEc4QfBkGOGhg6Xh7UOZRRaG6y1CDEABiEAgTUWZw21KGzObNywb2pyct9at/fJ2XNnvlRV5V9qrY74fvCjN/n1ACDawrlrpalu8Ky9DendHHrc6EkxEgchURRSiyLiWg0/ikBKnLUMHGZxjiuEOQDFw/N9hLFUVYU2ergyJEJ6SOlRKYXSJc7BaLs51dy775+t37jp47NvnPtynmZ/qXT1kheEvzIAAgE7ENzmOXOHc+bW0gu3FlG4kaiBTJbp1sYogyalqvCTDmE3ZSQsWFf3abUaeFEMzqHVwDjheXhegNaaqiox1gx+Ex5S+hitKaoKay1yyPBCeGijKMsBEK1Wa/zaPTd+am1t9aGVpaWv9ntrX3TWHRRS/GIAuMtL8kfruhkINy5w+53jXunsHZXjulQEI6vxeJjmKWljCq85yqjNaVQZvbwiabRJhMH1M5ZVSGFjGt0+2y8tsqchmB4foVarowRUZYkxBun5SM/DOajKitzYoecH3ncO8qLEGoOUHg6BQ6KNRpUpzjnq9dqGcGbzP2mOjP7h8qX5r3W7q/8V5w45R/VzAZBSEvoSZ8xw3+EFYfDppcz+81VlxwrnE9uck33H6eZW4qDJmDqHLC3NSEG2SLc+TVzM0+ksYeIRpDE4K0iF5JRuoSIfvTjLxbmceyZCtk+28OsNLJKiLLDG4nkeQvoIpynLEmPdkA8EUg5CYF4WWDt8TScAiTYKVVRY6wh8f3xq4+Y/ro+Mf7Szsvx4nudfttZ+1/eDOSklYki2VwBwzuH7Pq16hK4UzjnGA6d/mIgv/dlC9Ee59cb2+jkLZoTpqgNqnlxuZaRSVFLTTnrk2tKXAXHYQq5cou+a1JRFaUGmDBtESaByTtHilV7F413BuxYucd90yJaJEfyoRmUVeVFgncOTHsLzwQ6AsEOLhfAAD2sqlNFYM8gpHALrJMpUGG2ojMGXfrR+4+bf9qz6bVP2D81fOPf9brf7+bIojiqlroBwZQtYJEr4xMLwrSXFfzhdnVtUYvGeZn7dfAqzVmDjCXaXF7nYGyEzAlFW+FQsigayqEhsTEMIVG8NaaGqNFpoNkU5J3qGeVXj5ijlK6se/yWJmc0S9iwk3L2hwdhIG+H5WFVR5jkOBkBID2ssSimsKXBCIJzAWYG2Bq0V1jqsFTjnUEqDKihUTq4qOqVm2Xj79cq8Dlbn/mx0YoIPfOBD5HmGED9BggJHYRzXNn3+eDPh83Mdu9ZTHCsb1P2CC7pOLZ5kOp2n70I2NTSd0qfn+9RMRaodRjaoZ2uk1iOrHJOxQpcV51OfxGh6tYh9XsLTRYPFSvDNeckTyzkPrcvYO10nrtcHjF9VFKoEKUDIoZcFWmmMNVgL2liyPCdN+vR7HbpZRqIUHSu5UAmcDMlcSLsZsV55R/et3/DGRx7+GFEYkBc5Ugh8IQS+5+F5sim02GgQm2KPG967Prj1jlZz3w8X+8z2U2ZTx5JOWE0bNAPHBj2HFiOc8zfQDBRWGAptyEzAGJakKNCuzoxX8OIyaG1AGY5pyY2RpdXNEc4hnOH5lRDCgJEow1vusn68jQwChJQoPTDYWEdZVmRpRj/pkCZ9iqoCB8oPGBsbYcPmrUxPjJJpyVpWkJUla2lJVmjGW+tG/+h33rMxajRXVlaWyqosEULgF2V164WF5X86Mdra2G419tTieLP0JQLBunqTmakJjKrI84JOVrCYVnRyGBU1ftjVtIplbOHRFT6pEaRW4kRMrVphe8Njvu+xmAuE07hKs6As14wFXBsVKOVRFYqtIwEba4L/s1hjq6swywl3TzriKCAtKrprK2RJH2sNgS+I6022bp6hNTbKxNg4rVaTZhwT+wIP8CUIKXBCYpwjKzTW2QeNc19dW1u5BO7VWq32Oefckr/WS1YWV1bd3ML8g0sraxc3rJ85MT7S3NpuN8OxZo1GLQYvwG+GTNUbTIxpKjXw9uR4we1FQScvWStSFlLDGyl0lGB3y2dB5Ty/VMc4hzGGShvK0nBsTbCv4VjKS0akz/5xnxdmcy4WPh+YqTGXOC6akPdNZrSlZaIZsXXjJK32CK1Wi1pcIwhDfCnADVJhZxSFHRCbkAKBwxmLNRprDeBGNNwpcPS7/fcmafYNIcSSL7zg3PhY+xPbZiYff+HFg//o8EvP/q+9+/YvL611Ppop+7uZldH20Zh6LaLZbNKq+QS+jyckUb1OrV5jRGtmtGZ3VZGXFd1cEfkT1DoZH9A5FxLDbGq5pB1SWU50DZtnPHY1FGP1iIVexUggOLDeZ99UwM6WhCBiIh6l5stheJTIy+HLObQqMcJDSoEArB2W6UpjrEY4ixDgrCXLMxbm53n99RMcO/46r5863e90Okjp4Z88doR1LeHy7tJXfOm/tm3Lhn8xNRpXofTM/7vgOl89q9fdP11xo3+BYyuW6ckpxmNY1wjYNBrRrA1yfI2H70fEfkgQG8rKsGsqYvekpigremXFcr/iQqI4vmKIQp/7rplESB9lYH3Lpx5InBNYIRHCYRgQnbUO6XkEvocQAicFRluUSlBVgVYKKQW+JwdEXhSsLK9w5tw5Xn/9BMdPnmJuYYlCGaJmm8bImGtunnTOOfzHvvo/8U3KysoqSbe39P4Pvr+0TjzUGJtM73f9qSnZZa6K0c1N3BSv8fKy4mg+zgFPU62WnFrp0vAcO0cHTB3GMY04JPB9jHUordHKYp1gshGyoRVyYKaOthItPALhkJ5AO0iqQY4nJHiexPc9Licv1hjSJENXJXmRoqqKwPeIwhCHo9ftcX52lpOnTnPy1BkuzC/Sy3JEEFFrtRndvAPf87DGoKoclfUHJFhvtmq+59/9oQ99+A82b9nyQL0WzShVBRs2rB+tRz4jUhGEIYmWjNU3c3OeU/kxryzDX53JOdfziYTiI7WA9eUcC3OWqVZMFAUIBAiBLwVSSqQ3WMaeFHjSgTBYIZBOMEj1JVJKPCGxVpOnCXmWkmcJRhVopUmyAm0005OjrCQpp06d5fiJU7xxcZ61NEU7gR/EhLU2o402RpVUSYelS7OoMscohdWay2W0v2nTlg99+KHf+9zU1PSG0XaTPEvodtco8gJkyNSGGTzPY8JZEB5VeRFPZ9y3bZprYkWfJo1aSMtlNP2dHBgZRXg+eVGSpBmdXo8kzbDOggGkQEofJ+RgyQ49bLSiqDLKPCHP+pRZRlmWVFpRKstyL+eNi5eYvTjL9Tu2kSYdXjx0FMOgipS+RPohflWgOoukeYquCpwxODcowRmmwUIKAj90Ukr8p7/75JOnTp34+PYdu+65Ye++W/bs2XPdlmu2boxqIyPtVgMpBJUq0cYiJRRK46xjIgy4aesk66cmaLbbfO4zn+GL/+2L7Ni+k527dnH9DTewdes2dm5ZhxdErKx26HQTirIc5vWGIksosj5pv0eW9rFWoSpNrgWJguV+xmgtplXz+N7BI1y6eAGTJWzdMMVqL6MoK0IJebdPlecYVQ4qOsEQWInwfMRlDWJIiMZof3JiKqjX6gyqicGIgXat3ti4ecs1112zdftN1++9ad8NN9y4a/uOHVvHJsb9OAhI+6ssLa/y8pFXSbtrTExOsGHdFK8cOcShgy/T7XTopzlhVKM1OsanPvknPPTQQyyvrKCUZmV1jYMvv0hndRmtKiSOWhxTq8VIITm3WvLKYkKa9OiuLLH3mk3snJnka998nPkLb2CKjHvveQdzs2d5+aXnqUXRsEweiig/qVoIgVKKIs8RQrB58xbuuvve3o5dOx8S8KQPXNaUMiDLs3ThxGvHXjnx2rGvf+uxr0+02iMz69ZvvPaGG/ft23fzrft379698+S5c5MXl1aCkVads3MLHD91htD3uHbvLTit8IQgDAM8L2B8fIxur4sfBIRRjYWFeVYvXSTwfcI4plSKheU1zs8tkOc52/fcQq+3hsl6mKyHsA6cpEgTiqSDKcuBnmAtUnhI/6cFEGctxhqqSuGcZWx8gnvufSfvvO9+brllP9PrNhCEgftZgogG+kC/3+vO9nvdl0+dOP7Vr/31l+vt0fF99z74ob/Yv3//TFnkxGGAdDWqSlEqjVaKPEtRZYlwllOnT9Jutdi0aTPbd+6k21nj9PkL9NKcS0srLK2s0k8S0qTP+rE2192wH5X0UWmPot9HlwpjHGXap0oTBALnGO7nH3nZOYeqKipVDRSj0VH23Xwr977ztzhw4B42b96M53koB9b30c4hrLsqRcgMr8oLwi6e947166Y2ZEmXtN9HK0VVlaiqGtyXJVqrgdZnFFopOqurnD51iqee+BYLyyt0swprFNZoMAqsG8TzSGCMpMwSVNanynporai0oUpTrFZ4QTgAYAiCc448z9Ba02g02LNrL7feeRd33/UOdl+/h1azgaoqCmORUYwrcqpjR3jt6BGWkuzqJbEwrrtae1Ru3bb9d+LAl6tLiwPtripRSqGrkrKsUFWJ0RpxWWKSgzqzVospioIs6VP2E6QUl624ovwIz0cpQ5n00NlgBVTKDLRDra5IVc46lFIoNRB7Nm3Zyi233sFtd97Ftdddz+TEBFI4qrKik+aEzSZ2dZnOU4+SPPE4/YOH+Pxqh9euRhP0goDW6CTCkwghWqPt9u1pt0ua9qlUhSpLdFVRVdWwZtfDsPMjxVgIgdaCNE3RWg9y9bcgLAClFGWaoLM+RdpHlRXGuivPcg6U1jTbIxy4934OvON+dl+/l8mJSXx/QGn9LEOGEUEYoC/Osvrdv6X75GMUp84SK0MYU1ce7cL8HAA8P6DZHB3EUmNwMGm1muh3V0mTBKUURim01hhrB5/GXFEXBvLTQNYCBjKXMVe+v5XEritNmfZRaZ8q76OVRmuNcxYhJc5ZvCDg4d//E5qt1sBoM2i9+TWBH0XILEEffZHsqSfIXngGu9whCqBd90mbY/3DYePZxYXlFbIifEsAhJD4vk8Y17BWX+kZAl6e9EgCjyIvMFajtbli+OBF3Y95/7LmCLxJ93970JWqKJIeJuvjlMINve/5Pl4QIBlEmHq9QZ7lSN8jbLXxAw81f5H88POUzz6NOn4QcqhHEE7FXIqb84cJnnsxV4+eXFp6lrJcAoT/VnGzVqsh5UAkNUPd/nKEqYqCoshRukLrgdfffP3ks+ByXh9gzAAA+TbL37oBGZZpD2kNnvTxA48wCvB9HykkuIFypZ3F1BtIozGvHkJ9/ymqw4dQc3NIoFEDf32D+Vrr9DNKPHG4lz82n3SPoNUyUA0jnfV/uq0lKIoC597GQ1qTZiVZlqKqckCEWg/LUYcQAs/z8f1BXu/7AZ43uP9JgC63oo3WVGVJEIRICdI6giAALJ4ETw62kjGDiKClQOQZ3uHv4j33FOb1Y6g0BwH1moBWw5xptI89q3jk8FL/yX6encCYFaAcMq/7MVlcCMG+ffuHALif0fNzJGmCzuZYXlujMoNYbKzDGksQeIRhgHMgpX/F05cf+VMACEFVFkgpufWuu7n/3Q+y1s0ZpO0SgR1wCJBmGaUXsnXPDey+Ziu1L/wn1HPPYoAogLAZ0mnU+z+Maq88X5n/++rC2ndMnp8H0qHHzVv2BYJGgy98/i/4rQfeS5Znb2u8FJKsKPnEP3gfn/jwRi6mN/EfP/89hOeQwuB5BimDK94XQgzECsGwHy8wxr7pDIIgzzIazSbvfu8HuXH/7dRrMWuds0PN35FlCUVZEDab3HzXO7muFvNuUzF98Qynly7hA1G7zkK9vnjQD599uaq+ceLS2rOUxQKQD5e5+ZmNkW//5z/nHffdj1lbG8bmt2+CGiH42MMPM+E9zVKhKMqSKJL84e+/iwMHbuXzX/jfnDi1RBhe9r6k0j5SOoLAYa0eZm2WPC/ZvOUaHnj/h5nZsoU8z5DOInAkaUrcbnP9Hfeyd+8eJtM1/nHVZ/K1F3AIjqzbjHNQTE6e+07gP34oyx9byPuHqMqlobctP9bo+hkA7H3+JWafeOpnMvOQoZBRxKf//b/jOy/fxkuf+SzNRkiS9Nl/2508/LFP8cjXH+eHx+eAOg7JSN3n9+4NmUum+M4rq4MusFLgLPtvu5P7Hng/tVpEkqY4z8MEkqjd5rZ3Psi7dm5j7+Ic5alX6DQbpCde4dWxKY5b9MLs7Ik8S//mRJ4/3l0rXsOYtTcZ/ou1eE+/631XfcrB4XZNfPQPXhr9hx8fqQKfl154gb999FHybAVsxZe/8ggLlzqEYYDwIvbOSL752Tt5ee0mPvkv/5o33jhDGIbc/+AHuf2uA2gHBRanNf7iJRrLS2zato3mwRcRxw/RqRzze67nXHuMzqlTydzyytHVPHvkQpk/mZXlueFBib+T4VcAOHnfg1d/8MHaXdK5lxp3Hxhpv+8B6rffBo06qVIcf/VV5ubmOX/2LGfOnOGN2QuUSZcHb4k5t+bxzOFltFXcdMvtXLt3H7nV6KSPPH+W8AdHqZ14jbrnM7FvN2uvn+Lc9BQrfsja8urywtLSMwvafOOSrp7JqurikM3Nz9vfVwXA89fsuPrJQlyLcwcDJ5rR+Dj1Xbuo3XIz7TtupbbvJpicuDI3yXPm1/qcn73E6soKvX6PxbUuCEm+cBH76hHCIwfxL84SFDkhUI2Ncf6O21m9cJEiyWfn+71Hz2fpYx2jDxVKXQLUL7K/r8qm79daVzXRWovDTV6qiiPG82aafkQtCKjFNeKxMWozm4h3bKe2awfRjh2I6XUUjQZ9B51eytzCIoefe4701cPIHxzBW13BdxYPiBA0PI9uHOuX6o2TF5175GTSe6xXlseNc503Gf5LH+JPw/iqJtbrdYSUnHH24WJt9V9NwJ4p8MYRjEYR7bhOLY6J45iw3iRqtwmaLbx6nbhWYyVN+NK3H6cYejsQktg56kFAXqsnp+P48FHnHjmR9J5M8vzsMIxVvyrDr0SBf1MVVzVxfGYDwpNiZsPG77WybOtCnv9pev4NGaWJ2aDK+noBk1YzpitGq4J61iMOI6IoolVvUngeWggM4COIw5Ck3lg+6AfPHNXV35ztdZ6mKC4OvW1+1Yb/wkdkmsZsvn3//n89Pj7+YK51FAZBbWnnwpnjR48eO7m8PBqV5fiIc5NTMDItRLBOSjFurWirigmjacQxRgpEENIZHT33jOd981iWPbqc9I6g1OLQcMeveVw1AI1G4yNxFH3k1R/84LW5ubnjkxMTW7Zs2bL17vvvP2DBpN1ud2Vx8fzswqXe652O9bM02jY1ve2aiYlNk1KKsKrSV6V3ZK4RPnE+Tb+dFvnrWNsdLvNfu+E/dcbt580Lw3BdGIbbkiTRwCgwDky2Wq2N69at275h48adk+PjI+PT09PO2qLb7fbjON4Q12qN115/7blXjr7y5/1u9yDOXRrub/XrWua/FADe5KUG0BxeI0ALqAFTe/fu/d3bb7vtA77v+3Pz82eFEFopdf7555//t91u99nhc/Rv0uN/VwDe7r/hsJ/gh2E488B73vNZY6139OjRry0tLX3f9/2Oc27BGLP2lqXw34Px/wcApQ94o5Nhoa8AAAAASUVORK5CYII=");
    // const myImage = require('./image/line.png');
    // const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');
    // const resolvedImage = resolveAssetSource(myImage);
    // console.log(resolvedImage);
    // var img = await image.createObjByLocalPath(resolvedImage);
    var img = await image.createObjByLocalPath(IMG_FILE_PATH);
    var gi = new GraphicImage();
    this.graphicImage = await gi.createObj();
    //console.log("获取graphicImage的ID:" + this.graphicImage._MGGraphicImageId);
>>>>>>> 23b17fd1f7e2657202536e45426fcbe9b8e226c6
    await this.graphicImage.setImage(img);
    await this.graphicImage.setPoint(center);

    this.graphicsOverlay = await this.mapView.getGraphicsOverlay();
    await this.graphicsOverlay.addGraphic(this.graphicImage);
    await this.mapView.refresh();
  };

  render() {
    return (
      <View style={styles.container}>
        <MGMapView
          ref="mapView"
          onGetInstance={this.onGetInstance}
          style={styles.mapView}
        />
<<<<<<< HEAD
=======
        <Image source={require('./image/line.png')} style={styles.icon} />
>>>>>>> 23b17fd1f7e2657202536e45426fcbe9b8e226c6
      </View>
    );
  }
}
