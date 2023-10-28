import { setActivePinia, createPinia } from 'pinia'
import { mount, shallowMount } from '@vue/test-utils';
import { useTaskStore } from '../stores/task';
import AddNewTask from '../components/AddNewTask.vue';
import TaskList from '../components/TaskList.vue';
import { v4 as uuidv4 } from 'uuid';

beforeAll(() => {
    setActivePinia(createPinia());
});

describe('Page Loading Stage', () => {

    test('Create a Store', () => {
        const store = useTaskStore();
        expect(store).toBeDefined();
    })

    test('Form for Creating a Task', async() => {
        const wrapper = mount(AddNewTask);

        const formLabel = wrapper.get('[data-test="form-label"]');
        expect(formLabel.text()).toBe('Create Your New Task')

        const formSubmit = wrapper.get('[data-test="form-submit"]');
        expect(formSubmit.text()).toBe('Create Now')
    })
})

describe('Conditions When the UpdatingTaskData State Is Not Null', () => {

    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('Update Task Form', async () => {
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

describe('Form Submission Test', () => {

    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('Add a Task', async () => {
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

    test('Update a Task', async () => {
        const store = useTaskStore();
        const addNewTaskWrapper = mount(AddNewTask)
        const taskListWrapper = mount(TaskList)

        const formLabel = addNewTaskWrapper.get('[data-test="form-label"]');
        const formSubmit = addNewTaskWrapper.get('[data-test="form-submit"]');
        const input = addNewTaskWrapper.find('input')

        expect(formLabel.text()).toBe('Create Your New Task')
        expect(formSubmit.text()).toBe('Create Now')
        
        store.updatingTaskData = null;
        const newTask: TaskInterface = { id: '3', name: 'Task 3' };
        store.setUpdatingTaskData(newTask);
        expect(store.updatingTaskData).toEqual(newTask); 

        await addNewTaskWrapper.vm.$nextTick();

        expect(formLabel.text()).toBe('Update Task')
        expect(formSubmit.text()).toBe('Update Now')

        
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

    test('Should update the form with a task name while updating', async () => {

        const newId = uuidv4();
        const store = useTaskStore();
        const wrapper = mount(AddNewTask);

        store.updatingTaskData = null;
        const newTask: TaskInterface = { id: newId, name: `Task ${newId} from testing` };
        store.setUpdatingTaskData(newTask);
        expect(store.updatingTaskData).toEqual(newTask);

        await wrapper.vm.$nextTick();
    
        const input = wrapper.find('input');
        expect(input.element.value).toBe(newTask.name);
    
        const form = wrapper.find('[data-test="form-submit"]');
        await form.trigger('submit');

        await wrapper.vm.$nextTick();
    
        setTimeout(() => {
            expect(store.updateTask).toHaveBeenCalled();
        }, 1000);
    });

    test('Should submit the form with a task name', async () => {

        const store = useTaskStore();
        const wrapper = shallowMount(AddNewTask);
    
        // Simulate user input
        const input = wrapper.find('input#taskInput');
        await input.setValue('Sample Task');
    
        // Simulate form submission
        const form = wrapper.find('[data-test="form-submit"]');
        await form.trigger('submit');

        await wrapper.vm.$nextTick();
    
        setTimeout(() => {
            expect(wrapper.find('[data-test="form-error"]').isVisible()).toBe(false);
            expect(store.createTask).toHaveBeenCalled();
        }, 1000);
    });

    test('Show Error Text When the User Does Not Type a Name and Click the Submit Button', async() => {
        const addNewTaskWrapper = mount(AddNewTask);

        const input = addNewTaskWrapper.find('input');
        expect(input.element.value).toBe('');

        await addNewTaskWrapper.find('[data-test="form-submit"]').trigger('click');
        await addNewTaskWrapper.vm.$nextTick();

        setTimeout(() => {
            expect(addNewTaskWrapper.vm.showError).toBe(true);
        }, 1000);

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
            expect(addNewTaskWrapper.vm.showError).toBe(false);
        }, 1000);
    })
})

describe('Not Now Button Behaviors', () => {
    test('Not Now Button', async() =>{
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