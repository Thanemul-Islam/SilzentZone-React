import ExpoModulesCore

// iOS has no public API for a third-party app to silence the ringer or toggle
// Focus/Do Not Disturb. This module is a no-op stub with matching signatures
// so JS code never needs to branch on Platform.OS to call it.
public class SilentZoneRingerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("SilentZoneRinger")

    Function("isDndAccessGranted") { () -> Bool in
      false
    }

    Function("requestDndAccess") { () -> Void in
    }

    Function("setSilentMode") { (_ silent: Bool, _ totalSilence: Bool) -> Bool in
      false
    }

    Function("getCurrentInterruptionFilter") { () -> Int in
      -1
    }
  }
}
