// 加法：使用reduce方法，将数组中的每个元素相加

function SUM(arr) {
  return arr.reduce((a, b) => a + b);
}

// 减法：将第一个数减去后面所有的数

function SUBTRACT(arr) {
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result -= arr[i];
  }
  return result;
}

// 乘法：使用reduce方法，将数组中的每个元素相乘

function MULTIPLY(arr) {
  return arr.reduce((a, b) => a * b);
}

// 除法：将第一个数除以后面所有的数

function DIVIDE(arr) {
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result /= arr[i];
  }
  return result;
}
