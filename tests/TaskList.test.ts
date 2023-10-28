import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils';
import { useTaskStore } from '../stores/task';
import TaskList from '../components/TaskList.vue';

beforeAll(() => {
    setActivePinia(createPinia());
});

describe('TaskList Loading Stage', () => {

    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('Task List Component', async() => {
        const store = useTaskStore();
        const wrapper = mount(TaskList);

        expect(store.tasks).toHaveLength(0);
        expect(store.isLoading).toBe(true);

        await store.getAllTasks();

        expect(store.tasks).not.toHaveLength(0);
        const listItem = wrapper
            ?.findAll('.taskList__listItem__name');
        expect(listItem).not.toBeNull();
    })

})

describe('Button Behaviors', () => {

    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('Edit Task Button', async()=>{
        const store = useTaskStore();
        const wrapper = mount(TaskList);

        await store.getAllTasks();
        expect(store.tasks).not.toHaveLength(0);

        setTimeout(async () => {
            expect(wrapper.findAll('[data-test="task-li"]')).not.toHaveLength(0);
            const buttonEdit = wrapper.find('[data-test="button-edit"]');

            await buttonEdit.trigger('click');
            expect(store.updateTask).toHaveBeenCalled();
        }, 500); 
    })

    test('Delete Task Button', async()=>{
        const store = useTaskStore();
        const wrapper = mount(TaskList);
    

        await store.getAllTasks();
        expect(store.tasks).not.toHaveLength(0);

        setTimeout(async () => {
            expect(wrapper.findAll('[data-test="task-li"]')).not.toHaveLength(0);
            const buttonDelete = wrapper.find('[data-test="button-delete"]');

            await buttonDelete.trigger('click');
            
            expect(store.deleteTask).toHaveBeenCalled();
        }, 500); 
        
    })
})