import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import { z } from 'zod'

const prisma = new PrismaClient()


const router = Router()

const jogadoresSchema = z.object({
    nome: z.string().min(4,
        { message: "Nome deve ter, no mínimo, 4 caracteres" }),
    dataNasc: z.string().refine(val => Number.isInteger(Date.parse(val)),
    { message: 'Informe uma data válida no formato Y-MM-DD'}),
    salario: z.number(),
    nacionalidade: z.string(),
    timeId: z.number(),
    posicao: z.string().min(4, {
        message: 'A posicão deve ter no mínimo 4 caracteres'
    })
})

router.get("/", async (req, res) => {
    try {
        const jogadores = await prisma.jogador.findMany({
            orderBy: { id: 'desc' },
            include: { time: true}
        })

        const jogadores2 = jogadores.map(jogador =>(
            {
                ...jogador,
                idade: new Date().getFullYear() - 
                    new Date(jogador.dataNasc).getFullYear()
            }
        ))
        res.status(200).json(jogadores2)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {
    const result = jogadoresSchema.safeParse(req.body)

    if (!result.success) {
        res.status(400).json({ erro: result.error.issues })
        return
    }

    const { nome, dataNasc, salario, nacionalidade, timeId, posicao } = result.data

    try {
        const jogador = await prisma.jogador.create({
            data: { nome, dataNasc: new Date(dataNasc), salario, nacionalidade, timeId, posicao }
        })
        res.status(201).json(jogador)
    } catch (error) {
        res.status(400).json({ erro: error })
    }
})


router.put("/:id", async (req, res) => {
    // recebe o id passado como parâmetro
    const { id } = req.params

//    const clubeSchema2 = clubeSchema.partial()

    const result = jogadoresSchema.safeParse(req.body)

    if (!result.success) {
        res.status(400).json({ erro: result.error.issues })
        return
    }

    const { nome, dataNasc, salario, nacionalidade, timeId, posicao } = result.data

    try {
        const jogador = await prisma.jogador.update({
            where: { id: Number(id) },
            data: { nome, dataNasc, salario, nacionalidade, timeId, posicao }
        })
        res.status(200).json(jogador)
    } catch (error) {
        res.status(400).json({ erro: error })
    }
})

router.delete("/:id", async (req, res) => {
    // recebe o id passado como parâmetro
    const { id } = req.params

    // realiza a exclusão da viagem
    try {
        const jogador = await prisma.jogador.delete({
            where: { id: Number(id) }
        })
        res.status(200).json(jogador)
    } catch (error) {
        res.status(400).json({ erro: error })
    }
})

router.patch("/:id", async (req, res) => {
    // recebe o id passado como parâmetro
    const { id } = req.params

//    const clubeSchema2 = clubeSchema.partial()

    const result = jogadoresSchema.partial().safeParse(req.body)

    if (!result.success) {
        res.status(400).json({ erro: result.error.issues })
        return
    }

    const { salario } = result.data

    try {
        const jogador = await prisma.jogador.update({
            where: { id: Number(id) },
            data: {  salario }
        })
        res.status(200).json(jogador)
    } catch (error) {
        res.status(400).json({ erro: error })
    }
})






export default router;