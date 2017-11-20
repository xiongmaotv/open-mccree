var hours = ['0', '1', '2', '3', '4', '5', '6',
  '7', '8', '9', '10', '11',
  '12', '13', '14', '15','0', '1', '2', '3', '4', '5', '6',
  '7', '8', '9', '10', '11',
  '12', '13', '14', '15', '0', '1', '2', '3', '4', '5', '6',
  '7', '8', '9', '10', '11',
  '12', '13', '14', '15','0', '1', '2', '3', '4', '5', '6',
  '7', '8', '9', '10', '11',
  '12', '13', '14', '15'
];
var days = ['domain','eq'];

var leftCvs = echarts.init(document.getElementById('left'));
leftCvs.width = 2000;
leftCvs.height = 500;

function eqcharts(data, data2) {
  var index = 0;
  var eqdata = getEqdata(data,data2);
  var option = {
    tooltip: {},
    visualMap: {
      show: false,
      max: 128,
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    xAxis3D: {
      show: false,
      type: 'category',
      data: hours
    },
    yAxis3D: {
      show: false,
      type: 'category',
      data: days
    },
    zAxis3D: {
      show: false,
      type: 'value',
      min:-20,
      max:128
    },
    grid3D: {
      show:false,
      boxWidth: 350,
      boxHeight: 250,
      boxDepth: 20,
      viewControl:{
        beta:0,
        alpha:0
      },
      light: {
        main: {
          intensity: 1
        },
        ambient: {
          intensity: 0.3
        }
      }
    },
    series: [{
      type: 'bar3D',
      data: eqdata,
      shading: 'color',
      label: {
        show: false
      },

      itemStyle: {
        opacity: 0.6
      },

      emphasis: {
        label: {
          show: false,
        },
        itemStyle: {
          color: '#900'
        }
      }
    }]
  }

  leftCvs.setOption(option);
}

function getEqdata(domaindata,eq) {
  var retArray = [];
  for (var i = 0; i < eq.length; i ++) {
    retArray.push({
      value: [i , 1 , eq[i] / 4]
    });
  }
  for (var i = 0; i < domaindata.length; i ++) {
    retArray.push({
      value: [i , 0 , Math.abs(domaindata[i] - 128)]
    });
  }
  return retArray;
}