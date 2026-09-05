import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import {useRouter} from 'expo-router';
import {api} from '../../services/api';
import {saveAdminToken, removeAdminToken} from '../../services/storage';

export default function AdminScreen() {
    const router = useRouter();

    // Auth State
    const [email, setEmail] = useState('admin@cvbuilder.com');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    // Data State
    const [dashboard, setDashboard] = useState < any > (null);
    const [users, setUsers] = useState < any[] > ([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState < 'metrics' | 'users' > ('metrics');

    async function handleAdminLogin() {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter admin email and password.');
            return;
        }

        setLoginLoading(true);
        try {
            const res = await api.adminLogin({email, password});
            await saveAdminToken(res.token);
            setIsLoggedIn(true);
            loadAdminData();
        } catch (err : any) {
            Alert.alert('Admin Auth Failed', err.message || 'Invalid admin credentials');
        } finally {
            setLoginLoading(false);
        }
    }

    async function loadAdminData() {
        setLoading(true);
        try {
            const [dashRes, userRes] = await Promise.all([api.adminDashboard(), api.adminGetUsers(),]);
            setDashboard(dashRes);
            setUsers(userRes || []);
        } catch (err : any) {
            console.log('Failed to load admin data:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleUserStatus(userId : string, currentStatus : boolean) {
        try {
            await api.adminToggleUser({
                userId,
                isActive: ! currentStatus
            });
            setUsers((prev: any[]) => prev.map(u => u.id === userId ? {
                ...u,
                isActive: ! currentStatus
            } : u));
        } catch (err : any) {
            Alert.alert('Error', err.message || 'Could not update user status');
        }
    }

    async function handleAdminLogout() {
        await removeAdminToken();
        setIsLoggedIn(false);
        setDashboard(null);
    }

    if (!isLoggedIn) {
        return (<View style={
            styles.containerCenter
        }>
            <View style={
                styles.card
            }>
                <Text style={
                    styles.adminTitle
                }>Admin Portal</Text>
                <Text style={
                    styles.adminSub
                }>Isolated Administration System</Text>

                <Text style={
                    styles.label
                }>Admin Email</Text>
                <TextInput style={
                        styles.input
                    }
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"/>

                <Text style={
                    styles.label
                }>Admin Password</Text>
                <TextInput style={
                        styles.input
                    }
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="••••••••"/>

                <TouchableOpacity style={
                        styles.btnPrimary
                    }
                    onPress={handleAdminLogin}
                    disabled={loginLoading}> {
                    loginLoading ? <ActivityIndicator color="#fff"/> : <Text style={
                        styles.btnPrimaryText
                    }>Admin Sign In</Text>
                } </TouchableOpacity>

                <TouchableOpacity onPress={
                        () => router.replace('/(tabs)')
                    }
                    style={
                        {
                            marginTop: 16,
                            alignItems: 'center'
                        }
                }>
                    <Text style={
                        {
                            color: '#0284c7',
                            fontSize: 13
                        }
                    }>Return to User Mobile App</Text>
                </TouchableOpacity>
            </View>
        </View>);
    }

    return (<ScrollView style={
        styles.container
    }>
        <View style={
            styles.topHeader
        }>
            <Text style={
                styles.headerTitle
            }>System Control Center</Text>
            <TouchableOpacity style={
                    styles.btnLogout
                }
                onPress={handleAdminLogout}>
                <Text style={
                    styles.btnLogoutText
                }>Sign Out</Text>
            </TouchableOpacity>
        </View>

        <View style={
            styles.tabNav
        }>
            <TouchableOpacity style={
                    [
                        styles.tabBtn,
                        activeTab === 'metrics' && styles.tabBtnActive
                    ]
                }
                onPress={
                    () => setActiveTab('metrics')
            }>
                <Text style={
                    [
                        styles.tabText,
                        activeTab === 'metrics' && styles.tabTextActive
                    ]
                }>Analytics & Revenue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={
                    [
                        styles.tabBtn,
                        activeTab === 'users' && styles.tabBtnActive
                    ]
                }
                onPress={
                    () => setActiveTab('users')
            }>
                <Text style={
                    [
                        styles.tabText,
                        activeTab === 'users' && styles.tabTextActive
                    ]
                }>Users ({
                    users.length
                })</Text>
            </TouchableOpacity>
        </View>

        {
        loading ? (<ActivityIndicator size="large" color="#0f766e"
            style={
                {marginTop: 40}
            }/>) : activeTab === 'metrics' ? (<View>
            <View style={
                styles.metricsGrid
            }>
                <View style={
                    styles.metricCard
                }>
                    <Text style={
                        styles.mValue
                    }> {
                        dashboard ?. stats ?. totalUsers || 0
                    }</Text>
                    <Text style={
                        styles.mLabel
                    }>Total Registered Users</Text>
                </View>
                <View style={
                    styles.metricCard
                }>
                    <Text style={
                        styles.mValue
                    }> {
                        dashboard ?. stats ?. totalCvs || 0
                    }</Text>
                    <Text style={
                        styles.mLabel
                    }>Total CVs Generated</Text>
                </View>
                <View style={
                    styles.metricCard
                }>
                    <Text style={
                        styles.mValue
                    }> {
                        dashboard ?. stats ?. totalPurchases || 0
                    }</Text>
                    <Text style={
                        styles.mLabel
                    }>Template Sales</Text>
                </View>
                <View style={
                    styles.metricCard
                }>
                    <Text style={
                        styles.mValue
                    }>₦{
                        (dashboard ?. stats ?. totalRevenue || 0).toLocaleString()
                    }</Text>
                    <Text style={
                        styles.mLabel
                    }>Total Platform Revenue</Text>
                </View>
            </View>
        </View>) : (<View> {
            users.map(u => (<View key={
                    u.id
                }
                style={
                    styles.userCard
            }>
                <View style={
                    {flex: 1}
                }>
                    <Text style={
                        styles.userName
                    }> {
                        u.fullName || 'No Name'
                    }
                        ({
                        u.email
                    })</Text>
                    <Text style={
                        styles.userSub
                    }>Joined: {
                        new Date(u.createdAt).toLocaleDateString()
                    }</Text>
                </View>

                <TouchableOpacity style={
                        [
                            styles.btnStatus,
                            u.isActive ? styles.btnSuspend : styles.btnActivate
                        ]
                    }
                    onPress={
                        () => handleToggleUserStatus(u.id, u.isActive)
                }>
                    <Text style={
                        styles.btnStatusText
                    }> {
                        u.isActive ? 'Suspend' : 'Activate'
                    }</Text>
                </TouchableOpacity>
            </View>))
        } </View>)
    } </ScrollView>);
}

const styles = StyleSheet.create({
    containerCenter: {
        flex: 1,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        padding: 20
    },
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 16
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 24,
        elevation: 4
    },
    adminTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f766e',
        textAlign: 'center'
    },
    adminSub: {
        fontSize: 13,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 4
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 6,
        marginTop: 10
    },
    input: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#0f172a'
    },
    btnPrimary: {
        backgroundColor: '#0f766e',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 20
    },
    btnPrimaryText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16
    },
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a'
    },
    btnLogout: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6
    },
    btnLogoutText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 12
    },
    tabNav: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#e2e8f0',
        borderRadius: 8,
        alignItems: 'center'
    },
    tabBtnActive: {
        backgroundColor: '#0f766e'
    },
    tabText: {
        fontSize: 13,
        color: '#334155',
        fontWeight: '600'
    },
    tabTextActive: {
        color: '#ffffff'
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12
    },
    metricCard: {
        width: '47%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 16,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        elevation: 2
    },
    mValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0f766e'
    },
    mLabel: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4
    },
    userCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        flexDirection: 'row',
        alignItems: 'center'
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0f172a'
    },
    userSub: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2
    },
    btnStatus: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6
    },
    btnSuspend: {
        backgroundColor: '#fee2e2'
    },
    btnActivate: {
        backgroundColor: '#dcfce7'
    },
    btnStatusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0f172a'
    }
});
