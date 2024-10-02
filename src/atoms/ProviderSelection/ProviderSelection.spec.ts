import { within, userEvent, expect } from '@storybook/test';

export const ProviderSelectionSpec = async ({
  canvasElement
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);
  const genderButton = await canvas.findByRole('button', {
    name: 'Gender'
  });
  const ethnicityButton = await canvas.findByRole('button', {
    name: 'Ethnicity'
  });
  const clinicalFocusButton = await canvas.findByRole('button', {
    name: 'Clinical Focus'
  });
  const deliveryMethodButton = await canvas.findByRole('button', {
    name: 'Delivery Method'
  });
  const locationButton = await canvas.findByRole('button', {
    name: 'Location'
  });

  const testApplyFilter = async ({
    button,
    filterName,
    autoClose
  }: {
    button: HTMLElement;
    filterName: string;
    autoClose?: boolean;
  }) => {
    const buttonText = button.innerText;
    await expect(button).toHaveClass('bg-slate-300');
    await userEvent.click(button);
    const closeButton = await canvas.findByLabelText('Close filter');
    await expect(closeButton).toBeVisible();
    const filterButton = await canvas.findByRole('button', {
      name: filterName
    });
    await expect(filterButton).toHaveTextContent(filterName);
    await userEvent.click(filterButton);
    if (!autoClose) {
      await expect(filterButton).toHaveClass('bg-primary');
      await userEvent.click(closeButton);
    }
    await expect(filterButton).not.toBeVisible();
    await expect(button).toHaveClass('bg-secondary');
    const clearFilter = await canvas.findByLabelText(
      `Clear ${buttonText} filter`
    );
    await userEvent.click(clearFilter);
    await expect(button).toHaveClass('bg-slate-300');
  };
  await testApplyFilter({
    button: ethnicityButton,
    filterName: 'White'
  });
  await testApplyFilter({
    button: genderButton,
    filterName: 'Female'
  });
  await testApplyFilter({
    button: clinicalFocusButton,
    filterName: 'ADHD'
  });
  await testApplyFilter({
    button: deliveryMethodButton,
    filterName: 'In-Person'
  });
  await testApplyFilter({
    button: locationButton,
    filterName: 'Colorado'
  });
  await testApplyFilter({
    button: locationButton,
    filterName: 'NY - Union Square',
    autoClose: true
  });
};
