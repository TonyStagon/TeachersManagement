import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testTeacherInsert() {
    console.log('Testing teacher insert with auth_user_id column...\n');

    // Generate a test UUID for auth_user_id
    const testAuthId = '00000000-0000-0000-0000-000000000001';
    const testEmail = `test-${Date.now()}@test.com`;
    const testFullName = 'Test Teacher';

    console.log(`Test auth_user_id: ${testAuthId}`);
    console.log(`Test email: ${testEmail}`);
    console.log(`Test full name: ${testFullName}`);

    try {
        // Try to insert a teacher record
        console.log('\n1. Inserting teacher record...');
        const teacherData = {
            auth_user_id: testAuthId,
            email: testEmail,
            full_name: testFullName,
            subject_specialization: 'Life Orientation',
            experience_years: 0,
        };

        console.log('Teacher data:', teacherData);

        const { data, error } = await supabase
            .from('teachers')
            .insert([teacherData])
            .select();

        if (error) {
            console.error('❌ Teacher insert error:', error.message);
            console.error('Error details:', error);
            return false;
        }

        console.log('✅ Teacher record created successfully!');
        console.log('Created teacher:', data);

        // Verify we can query by auth_user_id
        console.log('\n2. Querying teacher by auth_user_id...');
        const { data: fetchedTeacher, error: fetchError } = await supabase
            .from('teachers')
            .select('*')
            .eq('auth_user_id', testAuthId)
            .single();

        if (fetchError) {
            console.error('Error fetching teacher:', fetchError.message);
        } else {
            console.log('✅ Successfully fetched teacher:', fetchedTeacher);
        }

        // Clean up
        console.log('\n3. Cleaning up test record...');
        const { error: deleteError } = await supabase
            .from('teachers')
            .delete()
            .eq('auth_user_id', testAuthId);

        if (deleteError) {
            console.error('Error deleting test record:', deleteError.message);
        } else {
            console.log('✅ Test record deleted successfully');
        }

        console.log('\n🎉 Test completed successfully!');
        console.log('The database schema now accepts auth_user_id column.');
        return true;

    } catch (err) {
        console.error('Unexpected error:', err);
        return false;
    }
}

testTeacherInsert().then(success => {
    if (success) {
        console.log('\n✅ All tests passed! The fix is working correctly.');
    } else {
        console.log('\n❌ Tests failed. Please check the errors above.');
        process.exit(1);
    }
});