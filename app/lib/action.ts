'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache'
import postgres from 'postgres'
import { redirect } from 'next/navigation'

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: '请选择客户',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: '请输入大于 $0 的金额' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: '请选择发票状态',
  }),
  date: z.string(),
});
const CreateInvoice = FormSchema.omit({id: true, date: true})
const UpdateInvoice = FormSchema.omit({id: true, date: true})
const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};


export async function createInvoice(prevState: State, formData: FormData) {
  // safeParse() 会返回包含 success 或 error 字段的对象
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })
  // 如果表单验证失败，提前返回错误。否则继续。
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '字段缺失，创建发票失败',
    };
  }
  // 准备插入数据库的数据
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // 将数据插入数据库
  try {
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // 如果发生数据库错误，返回更具体的错误
    return {
      message: '数据库错误：创建发票失败',
    };
  }

  // 重新验证发票页面的缓存并重定向用户
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formDate: FormData) {
  const {customerId, amount, status} = UpdateInvoice.parse({
    customerId: formDate.get('customerId'),
    amount: formDate.get('amount'),
    status: formDate.get('status')
  })
  const amountInCents = amount * 100
  await sql`
      UPDATE invoices
      SET customer_id = ${customerId},
          amount=${amountInCents},
          status=${status}
      where id = ${id}
  `
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql` DELETE
             FROM invoices
             WHERE id = ${id}`
  revalidatePath('/dashboard/invoices');
}

