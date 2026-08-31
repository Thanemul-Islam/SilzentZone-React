module.exports = {
  expo: {
    name: "SilentZone",
    slug: "SilentZone",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "SilentZone",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_IOS_API_KEY,
      },
      bundleIdentifier: "com.anonymous.SilentZone",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.anonymous.SilentZone",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY,
        },
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-asset",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow SilentZone to use your location to detect when you enter or leave a Silent Zone, even when the app is closed.",
          locationAlwaysPermission:
            "Allow SilentZone to use your location in the background to detect Silent Zones.",
          locationWhenInUsePermission:
            "Allow SilentZone to use your location to show it on the map.",
          isIosBackgroundLocationEnabled: true,
          isAndroidBackgroundLocationEnabled: true,
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/icon.png",
          color: "#ffa001",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
