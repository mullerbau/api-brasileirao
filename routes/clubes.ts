import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import { z } from 'zod'

const prisma = new PrismaClient()


const router = Router()

const clubeSchema = z.object({
    nome: z.string().min(3,
        { message: "Nome deve ter, no mínimo, 3 caracteres" }),
    estado: z.string().length(2,
        { message: 'Estado deve possuir 2 caracteres'}),
})

router.get("/", async (req, res) => {
    try {
        const clubes = await prisma.clube.findMany({
            orderBy: { id: 'desc' },
        })
        res.status(200).json(clubes)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {
    const result = clubeSchema.safeParse(req.body)

    if (!result.success) {
        res.status(400).json({ erro: result.error.issues })
        return
    }

    const { nome, estado } = result.data

    try {
        const clube = await prisma.clube.create({
            data: { nome, estado }
        })
        res.status(201).json(clube)
    } catch (error) {
        res.status(400).json({ erro: error })
    }
})

router.put("/:id", async (req, res) => {
    // recebe o id passado como parâmetro
    const { id } = req.params

//    const clubeSchema2 = clubeSchema.partial()

    const result = clubeSchema.safeParse(req.body)

    if (!result.success) {
        res.status(400).json({ erro: result.error.issues })
        return
    }

    const { nome, estado } = result.data

    try {
        const clube = await prisma.clube.update({
            where: { id: Number(id) },
            data: { nome, estado }
        })
        res.status(200).json(clube)
    } catch (error) {
        res.status(400).json({ erro: error })
    }
})

router.delete("/:id", async (req, res) => {
    // recebe o id passado como parâmetro
    const { id } = req.params

    // realiza a exclusão da viagem
    try {
        const clube = await prisma.clube.delete({
            where: { id: Number(id) }
        })
        res.status(200).json(clube)
    } catch (error) {
        res.status(400).json({ erro: error })
    }
})

router.get("/transporte/:transp", async (req, res) => {
    // const { transp } = req.params
    const transp = req.params.transp
    try {
        const viagens = await prisma.viagem.findMany({
            where: { transporte: transp as Transportes }
        })
        res.status(200).json(viagens)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.get("/preco/:maximo", async (req, res) => {
    const { maximo } = req.params
    try {
        const viagens = await prisma.viagem.findMany({
            where: { preco: { lte: Number(maximo) } }
        })
        res.status(200).json(viagens)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.get("/destino/ordem", async (req, res) => {
    try {
        const viagens = await prisma.viagem.findMany({
            orderBy: { destino: 'asc' },
            select: {
                destino: true,
                preco: true,
                duracao: true
            }
        })
        res.status(200).json(viagens)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.get("/resumo/media", async (req, res) => {
    try {
        const viagens = await prisma.viagem.aggregate({
            _avg: {
                preco: true,
                duracao: true
            }
        })
        const dadosRetorno = {
            preco: viagens._avg.preco,
            duracao: viagens._avg.duracao
        }
        res.status(200).json(dadosRetorno)
        // res.status(200).json(viagens)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

export default router