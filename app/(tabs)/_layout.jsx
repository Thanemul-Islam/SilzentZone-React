import { View, Text, Image } from 'react-native'
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { icons } from '../../constants';

const TabIcon = ({ icon, ionicon, color, name, focused }) => {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', width: 72 }}>
            {icon ? (
                <Image
                    source={icon}
                    resizeMode='contain'
                    tintColor={color}
                    style={{ width: 22, height: 22, marginBottom: 2 }}
                />
            ) : (
                <Ionicons name={ionicon} size={22} color={color} style={{ marginBottom: 2 }} />
            )}
            <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                className={`${focused ? 'font-pextrabold' : 'font-pregular'}`}
                style={{ color, fontSize: 10 }}
            >
                {name}
            </Text>
        </View>
    )
}
const TabsLayout = () => {
  return (
    <>
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#ffa001',
                tabBarInactiveTintColor: '#cdcde0',
                tabBarStyle: {
                    backgroundColor: '#161622',
                    borderTopWidth: 1,
                    borderTopColor: '#232533',
                    height: 84,
                }
            }}

        >
        <Tabs.Screen
            name="index"
            options={{
                title: 'Map',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon
                        icon={icons.map}
                        color={color}
                        name="Map"
                        focused={focused}
                    />
                )
            }}
        />
        <Tabs.Screen
            name="zones"
            options={{
                title: 'Zones',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon
                        icon={icons.mute}
                        color={color}
                        name="Zones"
                        focused={focused}
                    />
                )
            }}
        />
        <Tabs.Screen
            name="settings"
            options={{
                title: 'Settings',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon
                        ionicon="settings-outline"
                        color={color}
                        name="Settings"
                        focused={focused}
                    />
                )
            }}
        />
        </Tabs>
    </>
  )
}

export default TabsLayout
