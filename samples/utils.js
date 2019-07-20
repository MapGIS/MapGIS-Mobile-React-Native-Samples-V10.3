import {
  Platform,
  PermissionsAndroid,
  Alert,
  NativeModules
} from "react-native";

export const appRootPath = "MapGISSample";

export function mapComponents(prefix, screens) {
  return Object.keys(screens).reduce((result, name) => {
    const screen = screens[name];
    const { title } = screen.navigationOptions;
    result[`${prefix}${name}`] = { screen, title };
    return result;
  }, {});
}

function checkGranted(granteds) {
  const values = Object.values(granteds);
  let isGranted = true;
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] != values[i + 1]) {
      isGranted = false;
      break;
    }
  }
  if (isGranted && values[0] === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }
  return false;
}

export async function requestMultiplePermission() {
  if (Platform.OS === "ios") return;

  try {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
    ];
    //返回得是对象类型
    const granteds = await PermissionsAndroid.requestMultiple(permissions);
    if (!checkGranted(granteds)) {
      throw new Error("授权拒绝，无法正常使用本应用");
    }
  } catch (err) {
    throw new Error("授权失败，无法正常使用本应用");
  }
}

export default { mapComponents, requestMultiplePermission };
