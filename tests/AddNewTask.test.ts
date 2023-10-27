import { setActivePinia, createPinia } from 'pinia'
import { mount, VueWrapper } from '@vue/test-utils';
import { useTaskStore } from '../stores/task';
import AddNewTask from '../components/AddNewTask.vue';
import TaskList from '../components/TaskList.vue';

beforeAll(() => {
    setActivePinia(createPinia());
});

describe('page loading stage', () => {

    test('create a store', () => {
        const store = useTaskStore();
        expect(store).toBeDefined();
    })

    test('form has to be for create task', async() => {
        const wrapper = mount(AddNewTask);

        const formLabel = wrapper.get('[data-test="form-label"]');
        expect(formLabel.text()).toBe('Create Your New Task')

        const formSubmit = wrapper.get('[data-test="form-submit"]');
        expect(formSubmit.text()).toBe('Create Now')
    })
})

describe('conditions when updatingTaskData state is not null', () => {

    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('update task form', async () => {
        const store = useTaskStore();

        store.updatingTaskData = { id: '3', name: 'Task 3' };

        const wrapper = mount(AddNewTask);

        const formLabel = wrapper.get('[data-test="form-label"]');
        expect(formLabel.text()).toBe('Update Task')

        const formSubmit = wrapper.get('[data-test="form-submit"]');
        expect(formSubmit.text()).toBe('Update Now')
        
        const input = wrapper.find('input');
        input.element.value = 'Task 3';
        await input.trigger('input');
        expect(input.element.value).toBe('Task 3');
    });
})

describe.only('Form Submission Test', () => {

    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('add a task', async () => {
        const addNewTaskWrapper = mount(AddNewTask)
        const taskListWrapper = mount(TaskList)

        const newTaskName = 'Watching mirror'

        const input = addNewTaskWrapper.find('input')
        await input.setValue(newTaskName)
        expect(input.element.value).toBe(newTaskName);

        await addNewTaskWrapper.find('button').trigger('click');

        const listItem = taskListWrapper
            ?.findAll('.taskList__listItem__name')
            ?.filter((span) => span.text() === newTaskName)
            ?.at(0)
            ?.element.closest('li');
        expect(listItem).not.toBeNull(); 
    })

    test('update a task', async () => {
        const store = useTaskStore();
        const addNewTaskWrapper = mount(AddNewTask)
        const taskListWrapper = mount(TaskList)

        const formLabel = addNewTaskWrapper.get('[data-test="form-label"]');
        const formSubmit = addNewTaskWrapper.get('[data-test="form-submit"]');

        expect(formLabel.text()).toBe('Create Your New Task')
        expect(formSubmit.text()).toBe('Create Now')
        
        store.updatingTaskData = null;
        const newTask: TaskInterface = { id: '3', name: 'Task 3' };
        store.setUpdatingTaskData(newTask);
        expect(store.updatingTaskData).toEqual(newTask); 

        await addNewTaskWrapper.vm.$nextTick();

        expect(formLabel.text()).toBe('Update Task')
        expect(formSubmit.text()).toBe('Update Now')

        const input = addNewTaskWrapper.find('input')
        expect(input.element.value).toBe(newTask.name);

        const updatedTaskName = 'Task is updated by shwe';
        await input.setValue(updatedTaskName);

        await addNewTaskWrapper.find('[data-test="form-submit"]').trigger('click');

        const listItem = taskListWrapper
            ?.findAll('.taskList__listItem__name')
            ?.filter((span) => span.text() === updatedTaskName)
            ?.at(0)
            ?.element.closest('li');
        expect(listItem).not.toBeNull(); 

    })

    test('show error text when user does not type name and click submit button', async() => {
        const addNewTaskWrapper = mount(AddNewTask);

        const input = addNewTaskWrapper.find('input');
        expect(input.element.value).toBe('');

        await addNewTaskWrapper.find('[data-test="form-submit"]').trigger('click');
        await addNewTaskWrapper.vm.$nextTick();

        let formError = addNewTaskWrapper.find('[data-test="form-error"]');
        expect(formError.isVisible()).toBe(true);
        
        const updatedTaskName = 'Task is updated by shwe';
        await input.setValue(updatedTaskName);
        expect(input.element.value).toBe(updatedTaskName);

        await addNewTaskWrapper.setData({});
        await addNewTaskWrapper.vm.$nextTick();

        setTimeout(() => {
            formError = addNewTaskWrapper.find('[data-test="form-error"]');
            expect(formError.isVisible()).toBe(false);
        }, 500);
    })
})

describe('Not now button behaviors', () => {
    test('Not now button', async() =>{
        const store = useTaskStore();
        const addNewTaskWrapper = mount(AddNewTask)

        const formLabel = addNewTaskWrapper.get('[data-test="form-label"]');
        const formSubmit = addNewTaskWrapper.get('[data-test="form-submit"]');
        
        store.updatingTaskData = null;
        const newTask: TaskInterface = { id: '3', name: 'Task 3' };
        store.setUpdatingTaskData(newTask);
        expect(store.updatingTaskData).toEqual(newTask); 

        await addNewTaskWrapper.vm.$nextTick();

        const input = addNewTaskWrapper.find('input')
        expect(input.element.value).toBe(newTask.name);

        const notNowButton = addNewTaskWrapper.find('[data-test="update-cancel"]')
        expect(notNowButton.isVisible()).toBe(true);

        await addNewTaskWrapper.find('[data-test="update-cancel"]').trigger('click');
            
        expect(input.element.value).toBe('');
        expect(formLabel.text()).toBe('Create Your New Task')
        expect(formSubmit.text()).toBe('Create Now')
    })
})