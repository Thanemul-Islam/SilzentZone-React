import { View, Text, Image } from 'react-native'
import {Tabs, Redirect} from 'expo-router';

import {icons} from '../../constants';


const TabIcon = ({icon, color,name,focused}) => {
    return (
        <View className="items-center justify-center gap-2">
            <Image 
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className='w-6 h-6'
            />
            <Text className={`${focused ? 'font-pextrabold' : 'font-pregular'} test-xs`} style={{color: color}}>
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
            name="home"
            options={{
                title: 'Map',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon 
                        icon={icons.map}
                        color={color}
                        name="Home"
                        focused={focused}
                    />
                )
            }}
        />
        <Tabs.Screen 
            name="bookmark"
            options={{
                title: 'SilentZone',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon 
                        icon={icons.mute}
                        color={color}
                        name="Silent Zones"
                        focused={focused}
                    />
                )
            }}
        />
        <Tabs.Screen 
            name="create"
            options={{
                title: 'Create',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon 
                        icon={icons.schedule}
                        color={color}
                        name="Schedule"
                        focused={focused}
                    />
                )
            }}
        />
        <Tabs.Screen 
            name="profile"
            options={{
                title: 'Profile',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon 
                        icon={icons.profile}
                        color={color}
                        name="Profile"
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