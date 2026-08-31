package expo.modules.silentzoneringer

import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class SilentZoneRingerModule : Module() {
  private val notificationManager: NotificationManager
    get() = appContext.reactContext!!
      .getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

  override fun definition() = ModuleDefinition {
    Name("SilentZoneRinger")

    Function("isDndAccessGranted") {
      notificationManager.isNotificationPolicyAccessGranted
    }

    Function("requestDndAccess") {
      val intent = Intent(Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK
      }
      appContext.reactContext?.startActivity(intent)
    }

    Function("setSilentMode") { silent: Boolean, totalSilence: Boolean ->
      if (!notificationManager.isNotificationPolicyAccessGranted) {
        return@Function false
      }
      val filter = if (!silent) {
        NotificationManager.INTERRUPTION_FILTER_ALL
      } else if (totalSilence) {
        NotificationManager.INTERRUPTION_FILTER_NONE
      } else {
        NotificationManager.INTERRUPTION_FILTER_PRIORITY
      }
      notificationManager.setInterruptionFilter(filter)
      true
    }

    Function("getCurrentInterruptionFilter") {
      notificationManager.currentInterruptionFilter
    }
  }
}
