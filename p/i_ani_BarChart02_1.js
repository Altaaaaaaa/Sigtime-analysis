//http://codelib.tistory.com/14
//데이터셋은 CSV 파일
d3.csv("./js/data2.csv", function(error, data) {
    var dataSet = []; //데이터를 저장할 배열 변수
    var labelName = []; //레이블을 넣을 배열 변수
    for ( var i in data[0]) { //최초의 데이터만 처리
        dataSet.push(data[0][i]); //가로 한 줄 모두를 한꺼번에 넣음
        labelName.push(i); //레이블 넣음
    }
 
    //SVG요소의 넓이와 높이를 구함
    var svgEle = document.getElementById("myGraph");
    var svgWidth = window.getComputedStyle(svgEle, null).
    getPropertyValue("width");
    var svgHeight = window.getComputedStyle(svgEle, null).
    getPropertyValue("height");
    //https://developer.mozilla.org/ko/docs/Web/API/Window/getComputedStyle
    svgWidth = parseFloat(svgWidth); //값은 단위가 있으므로 단위를 삭제
    svgHeight = parseFloat(svgHeight); //값은 단위가 있으므로 단위를 삭제
 
    //그래프에 사용할 변수
    var offsetX = 40; //X 좌표의 오프셋(어긋난 정도)
    var offsetY = 30; //Y 좌표의 오프셋(어긋난 정도)
    var barElements; //막대그래프의 막대 요소를 저장할 변수
    var dataMax = 400; //데이터의 최댓값
    var barWidth = 40; //막대의 넓이
    var barMargin = 15; //막대의 옆 간격
 
    //그래프 그리기(그래프 옵션)
    barElements = d3.select("#myGraph")
    .selectAll("rect") //rect 요소를 지정
    .data(dataSet) //데이터를 요소에 연결
 
    //데이터가 추가될 때
    barElements.enter() //데이터 개수 만큼 반복
    .append("rect") //데이터 개수만큼 rect 요소가 추가됨
    .attr("class", "bar") //CSS 클래스를 지정
    .attr("height", 0) //초깃값 0으로 설정
    .attr("width", barWidth) //넓이 지정
    .attr("x", function(d, i) { //X 좌표를 지정함
        //X좌표를 표시 순서
        return i * (barWidth + barMargin) + offsetX + barMargin; //처음 Y축과 간격
    })
    .attr("y", svgHeight - offsetY) //그래프 가장 아래에 좌표를 설정
 
    //이벤트 추가
    .on("mouseover", function() {
        d3.select(this)
        .style("fill", "LightCoral") //마우스오버시 색상
    })
    .on("mouseout", function() {
        d3.select(this)
        .style("fill", "LightPink") //마우스아웃시 색상
    })
 
    //애니메이션 처리
    .transition()
    .duration(1000) //1초동안 애니메이션 처리
    .delay(function(d, i) {
        return i * 400; //0.4초 대기
    })
    .attr("y", function(d, i) { //Y 좌표를 지정
        return svgHeight - d - offsetY; //Y 좌표를 계산
    })
    .attr("height", function(d, i) { //넓이설정.2번째의 파라미터에 함수지정
        return d; //데이터 값을 그대로 높이로 지정
    })
 
    //text 요소 지정
    barElements.enter()
    .append("text") //text 요소 추가
    .attr("class", "barNum") //CSS 클래스를 지정
    .attr("x", function(d, i) { //X 좌표를 지정함
        //막대그래프의 표시 간격을 맞춤
        return i * (barWidth + barMargin) + offsetX + (barWidth/2 + barMargin);
    })
    .attr("y", svgHeight - 10 - offsetY) //Y 좌표 출력 위치 지정
    .text(function(d, i) { //데이터 표시
        return d;
    })
 
    //눈금을 표시하기 위한 스케일 설정
    var yScale = d3.scaleLinear() //스케일 설정
    .domain([ 0, dataMax ]) //원래크기
    .range([ dataMax, 0 ]) //실제 출력 크기
 
    //세로(Y축) 방향의 눈금을 설정하고 표시
    d3.select("#myGraph")
    .append("g")
    .attr("class", "axis")
    .attr("transform",
            "translate(" + offsetX + "," + ((svgHeight - dataMax) - offsetY) + ")")
    .call(d3.axisLeft(yScale)//스케일 적 용
            .ticks(10)//눈금의 표시 위치를 왼쪽으로 지정
    )
 
    //가로(X축) 방향의 선을 표시
    d3.select("#myGraph")
    .append("rect")
    .attr("class", "axis_x")
    .attr("width", svgWidth)
    .attr("height", "1")
    .attr("transform",
            "translate(" + offsetX + ", " + (svgHeight - offsetY) + ")")
 
    //막대의 레이블을 표시
    barElements.enter()
    .append("text")
    .attr("class", "barName")
    .attr("x", function(d, i) { //X좌표 지정
        return i * (barWidth + barMargin) + offsetX + (barWidth/2 + barMargin); //막대그래프의 표시 간격을 맞춤
    })
    .attr("y", svgHeight - offsetY + barMargin)
    .text(function(d, i) {
        return labelName[i]; //레이블 이름을 반환
    })
 
});